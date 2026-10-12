/*
# Add face photo column and minigame XP support

1. Profile changes
- Add `face_photo` column (text, nullable) to store base64 camera photo data.
- Grant UPDATE on `face_photo` to authenticated so users can save their photo.

2. attend_elevate_session function update
- Add support for minigame session IDs (minigame-*) which award XP.
- Minigame XP is passed as part of the session ID: minigame-<amount> (e.g. minigame-10 awards 10 XP).
- Caps minigame XP at 50 per award to prevent abuse.

3. Security
- face_photo is user-controlled (only the owner can set it via existing UPDATE policy).
- No new policies needed — existing update_own_profile policy already covers the new column via the granted UPDATE privilege.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS face_photo text;

-- Re-grant UPDATE to include the new face_photo column along with existing allowed columns
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, course, face_photo) ON profiles TO authenticated;

-- Updated attend function with minigame support
CREATE OR REPLACE FUNCTION attend_elevate_session(p_session_id text)
RETURNS TABLE (new_points integer, new_attended text[])
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_points integer;
  v_attended text[];
  v_award integer;
  v_minigame_amount integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Extract base ID for daily workshops (strip the |date suffix)
  v_award := CASE
    WHEN p_session_id LIKE 'd1%' THEN 15
    WHEN p_session_id LIKE 'd2%' THEN 10
    WHEN p_session_id LIKE 'd3%' THEN 20
    WHEN p_session_id LIKE 'd4%' THEN 25
    WHEN p_session_id LIKE 'd5%' THEN 30
    WHEN p_session_id LIKE 'd6%' THEN 35
    WHEN p_session_id LIKE 'd7%' THEN 25
    WHEN p_session_id LIKE 'a1%' THEN 15
    WHEN p_session_id LIKE 'a2%' THEN 10
    WHEN p_session_id LIKE 'a3%' THEN 20
    WHEN p_session_id LIKE 'a4%' THEN 25
    WHEN p_session_id LIKE 'a5%' THEN 30
    WHEN p_session_id LIKE 'a6%' THEN 35
    WHEN p_session_id LIKE 'a7%' THEN 25
    WHEN p_session_id LIKE 'l1%' THEN 15
    WHEN p_session_id LIKE 'l2%' THEN 10
    WHEN p_session_id LIKE 'l3%' THEN 20
    WHEN p_session_id LIKE 'l4%' THEN 25
    WHEN p_session_id LIKE 'l5%' THEN 30
    WHEN p_session_id LIKE 'l6%' THEN 35
    WHEN p_session_id LIKE 'l7%' THEN 25
    WHEN p_session_id LIKE 'daily-%' THEN 18
    WHEN p_session_id LIKE 'py-%' THEN 20
    WHEN p_session_id LIKE 'minigame-%' THEN
      -- Extract the XP amount from session ID like "minigame-quiz-10"
      NULL
    ELSE NULL
  END;

  -- Handle minigame XP: session ID format is "minigame-<type>-<amount>"
  IF v_award IS NULL AND p_session_id LIKE 'minigame-%' THEN
    v_minigame_amount := substring(p_session_id from 'minigame-[a-z]+-([0-9]+)')::integer;
    -- Cap at 50 to prevent abuse
    IF v_minigame_amount IS NOT NULL AND v_minigame_amount <= 50 AND v_minigame_amount > 0 THEN
      v_award := v_minigame_amount;
    ELSE
      RAISE EXCEPTION 'Invalid minigame session';
    END IF;
  END IF;

  IF v_award IS NULL THEN RAISE EXCEPTION 'Unknown session'; END IF;

  SELECT points, attended INTO v_points, v_attended
  FROM profiles WHERE id = auth.uid() FOR UPDATE;

  IF v_attended @> ARRAY[p_session_id] THEN
    RETURN QUERY SELECT v_points, v_attended;
    RETURN;
  END IF;

  UPDATE profiles
  SET points = points + v_award,
      attended = array_append(attended, p_session_id)
  WHERE id = auth.uid()
  RETURNING points, attended INTO new_points, new_attended;

  RETURN NEXT;
END;
$$;

REVOKE EXECUTE ON FUNCTION attend_elevate_session(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION attend_elevate_session(text) TO authenticated;

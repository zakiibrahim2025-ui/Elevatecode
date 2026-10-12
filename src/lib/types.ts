export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  points: number;
  attended: string[];
  course: 'Digital' | 'Accounting' | 'Lab Science' | null;
  premium_booked_at: string | null;
  face_photo: string | null;
  created_at: string;
}

export interface AppearanceSettings {
  bgPrimary: string;
  bgAccent: string;
  accentColor: string;
  textColor: string;
  headingText: string;
}

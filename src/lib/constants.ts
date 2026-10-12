export type Course = 'Digital' | 'Accounting' | 'Lab Science';
export type AccessTier = 'Standard' | 'Advanced' | 'Premium';

export interface WorkshopForm {
  id: string;
  question: string;
  type: 'text' | 'choice';
  options?: string[];
  correctAnswer?: string;
  acceptableAnswers?: string[];
  explanation?: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: string;
  time: string;
  date: string;
  points: number;
  description: string;
  image: string;
  speaker: string;
  duration: string;
  course: Course;
  videoUrl: string;
  form: WorkshopForm[];
}

export interface PythonLesson {
  id: string;
  title: string;
  videoId: string;
  description: string;
  pausePoints: PausePoint[];
}

export interface PausePoint {
  atSeconds: number;
  question: string;
  type: 'multiple-choice' | 'code-input';
  options?: string[];
  correctAnswer: string;
  codeStarter?: string;
  explanation: string;
}

export interface Company {
  id: string;
  name: string;
  role: string;
  industry: string;
  courses: Course[];
  xpRequired: number;
  tier: AccessTier;
  premium: boolean;
  logo: string;
  location: string;
  description: string;
  image: string;
}

export const COURSES: Array<{ name: Course; detail: string; description: string }> = [
  { name: 'Digital', detail: 'Software development, programming & coding', description: 'Problem solving, programming, data, security, business context, and emerging technologies. Build, test, and maintain software in a collaborative environment.' },
  { name: 'Accounting', detail: 'Bookkeeping, financial accounting & costing', description: 'Financial accounting, bookkeeping, business mathematics, tax laws, ethics, and data-driven decision making. Prepare for careers in finance and professional services.' },
  { name: 'Lab Science', detail: 'Laboratory techniques, biology & chemistry', description: 'Biochemistry, cell biology, pathogens, immunology, analytical techniques, health & safety, and standard operating procedures in a laboratory environment.' },
];

// === Verified YouTube video IDs ===
// Digital: verified via web search (freeCodeCamp, CS50, etc.)
// Accounting: verified IDs from search results
// Lab Science: verified IDs from search results

export const DIGITAL_MEETINGS: Meeting[] = [
  { id: 'd1', title: 'Programming Fundamentals', type: 'Workshop', time: '15:30', date: 'Mon 12 Oct', points: 15, description: 'Write your first Python program: variables, loops, conditionals, and functions.', image: 'https://images.pexels.com/photos/9300722/pexels-photo-9300722.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Sarah Chen', duration: '90 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8', form: [
    { id: 'd1q1', question: 'Which of these is a valid Python variable name?', type: 'choice', options: ['2name', 'my-var', 'student_name', 'class'], correctAnswer: 'student_name', explanation: 'Variable names must start with a letter or underscore, cannot contain hyphens, and cannot be Python keywords.' },
    { id: 'd1q2', question: 'Which loop type would you use when you know the exact number of iterations?', type: 'choice', options: ['for loop', 'while loop', 'do-while loop', 'if statement'], correctAnswer: 'for loop', explanation: 'A for loop is ideal when you know exactly how many times to repeat.' },
    { id: 'd1q3', question: 'What is the output of print(type(42)) in Python?', type: 'choice', options: ["<class 'int'>", "<class 'float'>", "<class 'string'>", "<class 'number'>"], correctAnswer: "<class 'int'>", explanation: '42 is an integer, so type() returns the int class.' },
    { id: 'd1q4', question: 'Which symbol is used for assignment in Python?', type: 'choice', options: ['==', '=', '=>', ':='], correctAnswer: '=', explanation: 'A single = is the assignment operator in Python. == is for comparison.' },
    { id: 'd1q5', question: 'What does the len() function do?', type: 'choice', options: ['Returns the last item', 'Returns the length/count of an object', 'Returns the largest value', 'Returns the lowest value'], correctAnswer: 'Returns the length/count of an object', explanation: 'len() returns the number of items in a string, list, or other collection.' },
  ] },
  { id: 'd2', title: 'Software Design & Testing', type: 'Workshop', time: '12:15', date: 'Wed 14 Oct', points: 10, description: 'Learn to design, implement, and test software using agile methodologies.', image: 'https://images.pexels.com/photos/5989943/pexels-photo-5989943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'James Whitfield', duration: '60 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/y8TcPr73Bwo', form: [
    { id: 'd2q1', question: 'Which testing type checks individual components in isolation?', type: 'choice', options: ['Integration testing', 'Unit testing', 'System testing', 'User acceptance testing'], correctAnswer: 'Unit testing', explanation: 'Unit testing isolates and tests individual pieces of code.' },
    { id: 'd2q2', question: 'What does TDD stand for?', type: 'choice', options: ['Test-Driven Development', 'Total Data Design', 'Technical Design Document', 'Test Data Deployment'], correctAnswer: 'Test-Driven Development', explanation: 'TDD means writing tests before writing the code that satisfies them.' },
    { id: 'd2q3', question: 'In Agile, what is a "sprint"?', type: 'choice', options: ['A fixed time period for completing work', 'A type of code review', 'A deployment tool', 'A testing framework'], correctAnswer: 'A fixed time period for completing work', explanation: 'A sprint is a time-boxed iteration (usually 1-4 weeks) in Agile development.' },
    { id: 'd2q4', question: 'What is the purpose of version control (e.g. Git)?', type: 'choice', options: ['Speed up the computer', 'Track changes to code over time', 'Automatically test code', 'Compile code faster'], correctAnswer: 'Track changes to code over time', explanation: 'Version control systems like Git track code changes and enable collaboration.' },
    { id: 'd2q5', question: 'Which of these is a benefit of code reviews?', type: 'choice', options: ['They make code run faster', 'They reduce bugs and improve quality', 'They compile the code', 'They deploy the application'], correctAnswer: 'They reduce bugs and improve quality', explanation: 'Code reviews catch issues early and spread knowledge across the team.' },
  ] },
  { id: 'd3', title: 'Data & Databases', type: 'Workshop', time: '14:00', date: 'Thu 15 Oct', points: 20, description: 'Model data, write SQL queries, and understand relational database design.', image: 'https://images.pexels.com/photos/18510427/pexels-photo-18510427.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Prof. Marcus Reid', duration: '75 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/kbKty5ZVKMY', form: [
    { id: 'd3q1', question: 'Which SQL keyword retrieves data from a table?', type: 'choice', options: ['FETCH', 'SELECT', 'GET', 'RETRIEVE'], correctAnswer: 'SELECT', explanation: 'SELECT is the SQL keyword used to query data from a table.' },
    { id: 'd3q2', question: 'What does a primary key do?', type: 'choice', options: ['Links two tables together', 'Uniquely identifies each row in a table', 'Stores encrypted data', 'Counts the number of rows'], correctAnswer: 'Uniquely identifies each row in a table', explanation: 'A primary key is a column that uniquely identifies every row.' },
    { id: 'd3q3', question: 'Which SQL clause filters results?', type: 'choice', options: ['ORDER BY', 'WHERE', 'GROUP BY', 'LIMIT'], correctAnswer: 'WHERE', explanation: 'WHERE filters rows based on a condition.' },
    { id: 'd3q4', question: 'What is normalisation in database design?', type: 'choice', options: ['Making all columns text type', 'Organising data to reduce redundancy', 'Deleting unused tables', 'Encrypting the database'], correctAnswer: 'Organising data to reduce redundancy', explanation: 'Normalisation eliminates duplicate data and improves data integrity.' },
    { id: 'd3q5', question: 'Which join returns only matching rows from both tables?', type: 'choice', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correctAnswer: 'INNER JOIN', explanation: 'INNER JOIN returns only the rows that have matching values in both tables.' },
  ] },
  { id: 'd4', title: 'Web Development Bootcamp', type: 'Workshop', time: '10:00', date: 'Fri 16 Oct', points: 25, description: 'Build a responsive web app with HTML, CSS, and JavaScript fundamentals.', image: 'https://images.pexels.com/photos/4682189/pexels-photo-4682189.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Elena Vasquez', duration: '120 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/MBlkKE0GYGg', form: [
    { id: 'd4q1', question: 'Which language runs in the browser to add interactivity?', type: 'choice', options: ['Python', 'Java', 'JavaScript', 'C++'], correctAnswer: 'JavaScript', explanation: 'JavaScript is the language browsers run natively for interactivity.' },
    { id: 'd4q2', question: 'What does CSS stand for?', type: 'choice', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colourful Style Sheets'], correctAnswer: 'Cascading Style Sheets', explanation: 'CSS stands for Cascading Style Sheets and controls the visual presentation of web pages.' },
    { id: 'd4q3', question: 'Which HTML tag creates a hyperlink?', type: 'choice', options: ['<link>', '<a>', '<href>', '<url>'], correctAnswer: '<a>', explanation: 'The <a> (anchor) tag creates hyperlinks with the href attribute.' },
    { id: 'd4q4', question: 'What does the CSS box model consist of?', type: 'choice', options: ['Content, padding, border, margin', 'Width, height, colour, font', 'Header, body, footer, sidebar', 'Div, span, class, id'], correctAnswer: 'Content, padding, border, margin', explanation: 'The box model is: content + padding + border + margin surrounding every element.' },
    { id: 'd4q5', question: 'Which CSS property makes a layout adapt to different screen sizes?', type: 'choice', options: ['display', 'responsive', '@media', 'flexbox'], correctAnswer: '@media', explanation: 'Media queries (@media) apply different CSS rules based on screen size.' },
  ] },
  { id: 'd5', title: 'Cybersecurity Essentials', type: 'Workshop', time: '16:00', date: 'Mon 19 Oct', points: 30, description: 'Understand threats, encryption, and secure coding practices to protect applications.', image: 'https://images.pexels.com/photos/14000470/pexels-photo-14000470.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Tom Bradley', duration: '90 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/WO7wP3QaJ_g', form: [
    { id: 'd5q1', question: 'What does the CIA triad stand for in cybersecurity?', type: 'choice', options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Cyber Investigation & Analysis', 'Control, Inspect, Assess'], correctAnswer: 'Confidentiality, Integrity, Availability', explanation: 'The CIA triad is the core model for information security.' },
    { id: 'd5q2', question: 'Which attack tricks users into revealing credentials?', type: 'choice', options: ['DDoS', 'Phishing', 'SQL injection', 'Buffer overflow'], correctAnswer: 'Phishing', explanation: 'Phishing disguises fake messages as legitimate to steal credentials.' },
    { id: 'd5q3', question: 'What is encryption?', type: 'choice', options: ['Deleting data permanently', 'Converting data into a secret code', 'Compressing files', 'Backing up data to the cloud'], correctAnswer: 'Converting data into a secret code', explanation: 'Encryption scrambles data so only authorised parties with a key can read it.' },
    { id: 'd5q4', question: 'What is multi-factor authentication (MFA)?', type: 'choice', options: ['Using two passwords', 'Requiring more than one proof of identity', 'A type of encryption', 'A firewall setting'], correctAnswer: 'Requiring more than one proof of identity', explanation: 'MFA requires multiple verification methods (e.g. password + code from phone).' },
    { id: 'd5q5', question: 'Which of these is the strongest password?', type: 'choice', options: ['password123', 'John1990', 'Tr3e$B@nk!9xQ', 'qwerty'], correctAnswer: 'Tr3e$B@nk!9xQ', explanation: 'Strong passwords use a mix of upper/lower case, numbers, and special characters.' },
  ] },
  { id: 'd6', title: 'Emerging Technologies & AI', type: 'Seminar', time: '13:00', date: 'Wed 21 Oct', points: 35, description: 'Explore AI, machine learning, IoT, and the ethical implications of emerging tech.', image: 'https://images.pexels.com/photos/18602382/pexels-photo-18602382.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Priya Sharma', duration: '150 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/qYNweeDHiyU', form: [
    { id: 'd6q1', question: 'What is the difference between AI and machine learning?', type: 'choice', options: ['They are the same thing', 'AI is the broader concept; ML is a subset of AI', 'ML is broader than AI', 'AI only works on computers'], correctAnswer: 'AI is the broader concept; ML is a subset of AI', explanation: 'AI is the field of making machines smart. ML is one approach within AI.' },
    { id: 'd6q2', question: 'Which technology connects everyday objects to the internet?', type: 'choice', options: ['Blockchain', 'IoT', 'Virtual reality', 'Quantum computing'], correctAnswer: 'IoT', explanation: 'IoT (Internet of Things) connects physical devices to the internet.' },
    { id: 'd6q3', question: 'What is a neural network?', type: 'choice', options: ['A type of computer network cable', 'A computing model inspired by the human brain', 'A network security tool', 'A type of database'], correctAnswer: 'A computing model inspired by the human brain', explanation: 'Neural networks are layers of interconnected nodes that learn patterns from data.' },
    { id: 'd6q4', question: 'What is an ethical concern with AI?', type: 'choice', options: ['AI uses too much electricity', 'AI can perpetuate bias in decision-making', 'AI is too slow', 'AI cannot store data'], correctAnswer: 'AI can perpetuate bias in decision-making', explanation: 'AI trained on biased data can produce discriminatory outcomes — a key ethical concern.' },
    { id: 'd6q5', question: 'What does IoT stand for?', type: 'choice', options: ['Internet of Things', 'Input Output Technology', 'Integrated Online Tools', 'Internet of Tools'], correctAnswer: 'Internet of Things', explanation: 'IoT stands for Internet of Things — physical objects connected to the internet.' },
  ] },
  { id: 'd7', title: 'Business Context & Project Management', type: 'Lecture', time: '11:30', date: 'Fri 23 Oct', points: 25, description: 'Understand how software projects are managed, from requirements to delivery.', image: 'https://images.pexels.com/photos/6120214/pexels-photo-6120214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Aisha Patel', duration: '100 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/U28U5QXs4jk', form: [
    { id: 'd7q1', question: 'What is the difference between Agile and Waterfall?', type: 'choice', options: ['Agile is linear; Waterfall is iterative', 'Agile is iterative; Waterfall is linear/sequential', 'They are identical', 'Agile is only for large projects'], correctAnswer: 'Agile is iterative; Waterfall is linear/sequential', explanation: 'Waterfall completes phases in order. Agile works in short iterations.' },
    { id: 'd7q2', question: 'Which document defines project scope and deliverables?', type: 'choice', options: ['Risk register', 'Project charter', 'Code review', 'User manual'], correctAnswer: 'Project charter', explanation: 'The project charter formally defines scope, objectives, and deliverables.' },
    { id: 'd7q3', question: 'What is a "stakeholder"?', type: 'choice', options: ['A type of fence post', 'Anyone with an interest or investment in the project', 'A programming tool', 'A type of database'], correctAnswer: 'Anyone with an interest or investment in the project', explanation: 'Stakeholders are people or groups affected by or invested in the project outcome.' },
    { id: 'd7q4', question: 'What does MVP stand for in product development?', type: 'choice', options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Plan', 'Model View Presenter'], correctAnswer: 'Minimum Viable Product', explanation: 'An MVP is the simplest version of a product that can be released to users.' },
    { id: 'd7q5', question: 'What is a Gantt chart used for?', type: 'choice', options: ['Tracking code bugs', 'Visualising project schedule and tasks over time', 'Designing databases', 'Testing software'], correctAnswer: 'Visualising project schedule and tasks over time', explanation: 'A Gantt chart shows tasks along a timeline for project planning.' },
  ] },
];

export const ACCOUNTING_MEETINGS: Meeting[] = [
  { id: 'a1', title: 'Bookkeeping Fundamentals', type: 'Workshop', time: '15:30', date: 'Mon 12 Oct', points: 15, description: 'Master double-entry bookkeeping, ledgers, and trial balances from scratch.', image: 'https://images.pexels.com/photos/5716016/pexels-photo-5716016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Rachel Thompson', duration: '90 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a1q1', question: 'What is the accounting equation?', type: 'choice', options: ['Assets = Liabilities + Equity', 'Profit = Revenue - Costs', 'Cash In = Cash Out', 'Debits = Credits'], correctAnswer: 'Assets = Liabilities + Equity', explanation: 'The fundamental accounting equation: Assets = Liabilities + Owners Equity.' },
    { id: 'a1q2', question: 'Which side do assets appear on in a balance sheet?', type: 'choice', options: ['Right side', 'Left side', 'Top only', 'Bottom only'], correctAnswer: 'Left side', explanation: 'Assets are listed on the left (debit) side of a balance sheet.' },
    { id: 'a1q3', question: 'What is double-entry bookkeeping?', type: 'choice', options: ['Writing every entry twice', 'Every transaction has equal debits and credits', 'Keeping two copies of the ledger', 'Entering data in two books'], correctAnswer: 'Every transaction has equal debits and credits', explanation: 'Double-entry means every transaction affects at least two accounts with equal debits and credits.' },
    { id: 'a1q4', question: 'What is a ledger?', type: 'choice', options: ['A type of financial report', 'A book or file containing all accounts and transactions', 'A payment method', 'A type of tax form'], correctAnswer: 'A book or file containing all accounts and transactions', explanation: 'A ledger is the master record of all financial transactions organised by account.' },
    { id: 'a1q5', question: 'What does a trial balance check?', type: 'choice', options: ['That total debits equal total credits', 'That the business is profitable', 'That all invoices are paid', 'That cash is correct'], correctAnswer: 'That total debits equal total credits', explanation: 'A trial balance verifies that total debits equal total credits across all accounts.' },
  ] },
  { id: 'a2', title: 'Financial Statements', type: 'Workshop', time: '12:15', date: 'Wed 14 Oct', points: 10, description: 'Build income statements, balance sheets, and cash flow statements step by step.', image: 'https://images.pexels.com/photos/5989943/pexels-photo-5989943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'David Okoye', duration: '60 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a2q1', question: 'What does the income statement show?', type: 'choice', options: ['Cash position at a point in time', 'Revenue, expenses, and profit over a period', 'Assets and liabilities', 'Shareholder distributions'], correctAnswer: 'Revenue, expenses, and profit over a period', explanation: 'The income statement (P&L) shows financial performance over a time period.' },
    { id: 'a2q2', question: 'Which statement shows cash inflows and outflows?', type: 'choice', options: ['Balance sheet', 'Income statement', 'Cash flow statement', 'Trial balance'], correctAnswer: 'Cash flow statement', explanation: 'The cash flow statement tracks all cash entering and leaving the business.' },
    { id: 'a2q3', question: 'What is the balance sheet also known as?', type: 'choice', options: ['Profit and loss statement', 'Statement of financial position', 'Cash flow report', 'Trial balance'], correctAnswer: 'Statement of financial position', explanation: 'The balance sheet shows the financial position at a single point in time.' },
    { id: 'a2q4', question: 'What does "retained earnings" mean?', type: 'choice', options: ['Cash in the bank', 'Profit kept in the business rather than distributed', 'Money owed to suppliers', 'Total revenue'], correctAnswer: 'Profit kept in the business rather than distributed', explanation: 'Retained earnings are accumulated profits reinvested in the business.' },
    { id: 'a2q5', question: 'Which formula calculates net profit?', type: 'choice', options: ['Assets - Liabilities', 'Revenue - Total Expenses', 'Cash In - Cash Out', 'Debits - Credits'], correctAnswer: 'Revenue - Total Expenses', explanation: 'Net profit = total revenue minus all operating expenses and costs.' },
  ] },
  { id: 'a3', title: 'Costing & Management Accounting', type: 'Workshop', time: '14:00', date: 'Thu 15 Oct', points: 20, description: 'Explore marginal costing, absorption costing, and break-even analysis.', image: 'https://images.pexels.com/photos/6120214/pexels-photo-6120214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Helen Marsh', duration: '75 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a3q1', question: 'What is the difference between fixed and variable costs?', type: 'choice', options: ['Fixed costs change with production; variable costs do not', 'Fixed costs stay the same; variable costs change with production', 'They are the same thing', 'Fixed costs are always higher'], correctAnswer: 'Fixed costs stay the same; variable costs change with production', explanation: 'Fixed costs (rent) do not change with output. Variable costs (materials) do.' },
    { id: 'a3q2', question: 'At break-even point, what equals zero?', type: 'choice', options: ['Revenue', 'Profit', 'Fixed costs', 'Variable costs'], correctAnswer: 'Profit', explanation: 'At break-even, total revenue exactly equals total costs, so profit is zero.' },
    { id: 'a3q3', question: 'What is marginal costing?', type: 'choice', options: ['Charging the highest price possible', 'Only variable costs are considered as product costs', 'A type of tax', 'Pricing based on competitor analysis'], correctAnswer: 'Only variable costs are considered as product costs', explanation: 'Marginal costing treats only variable costs as product costs; fixed costs are period costs.' },
    { id: 'a3q4', question: 'How do you calculate contribution margin?', type: 'choice', options: ['Revenue - Fixed Costs', 'Selling Price - Variable Cost per unit', 'Revenue - Total Costs', 'Profit - Tax'], correctAnswer: 'Selling Price - Variable Cost per unit', explanation: 'Contribution margin = selling price minus variable cost per unit.' },
    { id: 'a3q5', question: 'What is absorption costing?', type: 'choice', options: ['Only variable costs are included', 'Both fixed and variable costs are included in product costs', 'A method of tax calculation', 'A type of depreciation'], correctAnswer: 'Both fixed and variable costs are included in product costs', explanation: 'Absorption costing allocates both fixed and variable manufacturing costs to products.' },
  ] },
  { id: 'a4', title: 'Tax & Regulatory Framework', type: 'Workshop', time: '10:00', date: 'Fri 16 Oct', points: 25, description: 'Understand UK tax law, VAT, PAYE, and the regulatory environment for accountants.', image: 'https://images.pexels.com/photos/39190475/pexels-photo-39190475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Marcus Lee', duration: '120 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a4q1', question: 'What does VAT stand for?', type: 'choice', options: ['Value And Tax', 'Value Added Tax', 'Variable Amount Tax', 'Vendor Added Tax'], correctAnswer: 'Value Added Tax', explanation: 'VAT is Value Added Tax — a consumption tax on goods and services.' },
    { id: 'a4q2', question: 'Which tax is deducted from employee salaries?', type: 'choice', options: ['Corporation tax', 'PAYE', 'VAT', 'Capital gains tax'], correctAnswer: 'PAYE', explanation: 'PAYE (Pay As You Earn) deducts income tax from salaries before payment.' },
    { id: 'a4q3', question: 'What is the current standard UK VAT rate (as of 2024)?', type: 'choice', options: ['15%', '20%', '25%', '10%'], correctAnswer: '20%', explanation: 'The standard UK VAT rate is 20%.' },
    { id: 'a4q4', question: 'Who pays corporation tax?', type: 'choice', options: ['Employees', 'Companies on their profits', 'Consumers at the till', 'Landlords only'], correctAnswer: 'Companies on their profits', explanation: 'Corporation tax is paid by limited companies on their taxable profits.' },
    { id: 'a4q5', question: 'What does HMRC stand for?', type: 'choice', options: ['Her Majestys Revenue & Customs', 'High Margin Revenue Centre', 'Historical Monetary Records Centre', 'Hire & Manage Revenue Collection'], correctAnswer: 'Her Majestys Revenue & Customs', explanation: 'HMRC is the UK government department responsible for tax collection.' },
  ] },
  { id: 'a5', title: 'Ethics & Professional Conduct', type: 'Seminar', time: '16:00', date: 'Mon 19 Oct', points: 30, description: 'Explore ethical dilemmas, professional standards, and the accountant code of conduct.', image: 'https://images.pexels.com/photos/7567556/pexels-photo-7567556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Sandra Williams', duration: '90 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a5q1', question: 'Why is independence important for an auditor?', type: 'choice', options: ['It makes audits faster', 'It ensures unbiased and objective opinions', 'It reduces audit cost', 'It is required by employees'], correctAnswer: 'It ensures unbiased and objective opinions', explanation: 'Independence means the auditor can give an honest opinion without conflicts of interest.' },
    { id: 'a5q2', question: 'Which principle requires accountants to act honestly?', type: 'choice', options: ['Integrity', 'Confidentiality', 'Competence', 'Objectivity'], correctAnswer: 'Integrity', explanation: 'Integrity means being honest and straightforward in all professional relationships.' },
    { id: 'a5q3', question: 'What is a conflict of interest?', type: 'choice', options: ['When two accountants disagree', 'When personal interests could compromise professional judgement', 'A type of accounting error', 'A tax violation'], correctAnswer: 'When personal interests could compromise professional judgement', explanation: 'A conflict of interest arises when personal interests could improperly influence professional duties.' },
    { id: 'a5q4', question: 'What does confidentiality require of an accountant?', type: 'choice', options: ['Sharing client data publicly', 'Not disclosing client information without authorisation', 'Only working with one client', 'Publishing all financial records'], correctAnswer: 'Not disclosing client information without authorisation', explanation: 'Confidentiality means protecting client information and not sharing it improperly.' },
    { id: 'a5q5', question: 'What is professional competence?', type: 'choice', options: ['Being competitive in pricing', 'Maintaining professional knowledge and skill', 'Having the most clients', 'Working long hours'], correctAnswer: 'Maintaining professional knowledge and skill', explanation: 'Professional competence means continually maintaining skills and knowledge.' },
  ] },
  { id: 'a6', title: 'Data Analytics for Finance', type: 'Workshop', time: '13:00', date: 'Wed 21 Oct', points: 35, description: 'Use data visualisation and analytics tools to support financial decision making.', image: 'https://images.pexels.com/photos/7567432/pexels-photo-7567432.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'James Patel', duration: '150 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a6q1', question: 'What is a pivot table?', type: 'choice', options: ['A type of chart', 'A tool to summarise and reorganise data', 'A financial formula', 'A type of spreadsheet error'], correctAnswer: 'A tool to summarise and reorganise data', explanation: 'Pivot tables group and summarise large datasets for analysis.' },
    { id: 'a6q2', question: 'Which tool is most commonly used for financial data visualisation?', type: 'choice', options: ['Excel', 'Notepad', 'Photoshop', 'Audacity'], correctAnswer: 'Excel', explanation: 'Excel is the industry standard for financial analysis and data visualisation.' },
    { id: 'a6q3', question: 'What is a financial dashboard?', type: 'choice', options: ['A type of cash register', 'A visual display of key financial metrics', 'A tax form', 'A type of bank statement'], correctAnswer: 'A visual display of key financial metrics', explanation: 'Dashboards display KPIs and metrics for quick decision-making.' },
    { id: 'a6q4', question: 'What does KPI stand for?', type: 'choice', options: ['Key Performance Indicator', 'Known Profit Index', 'Key Payment Instruction', 'Knowledge Process Integration'], correctAnswer: 'Key Performance Indicator', explanation: 'KPIs are measurable values that show how well objectives are being met.' },
    { id: 'a6q5', question: 'What is data cleansing?', type: 'choice', options: ['Deleting all data', 'Detecting and correcting errors in data', 'Encrypting data', 'Compressing data files'], correctAnswer: 'Detecting and correcting errors in data', explanation: 'Data cleansing removes inaccuracies, duplicates, and inconsistencies from datasets.' },
  ] },
  { id: 'a7', title: 'Business Environment & Strategy', type: 'Lecture', time: '11:30', date: 'Fri 23 Oct', points: 25, description: 'Understand business models, drivers for change, and how finance supports strategy.', image: 'https://images.pexels.com/photos/14000470/pexels-photo-14000470.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Fiona Reid', duration: '100 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'a7q1', question: 'What is a SWOT analysis?', type: 'choice', options: ['A financial formula', 'Strengths, Weaknesses, Opportunities, Threats', 'A type of tax audit', 'Sales, Wages, Operations, Tax'], correctAnswer: 'Strengths, Weaknesses, Opportunities, Threats', explanation: 'SWOT is a framework for assessing internal and external business factors.' },
    { id: 'a7q2', question: 'Which framework analyses industry competition?', type: 'choice', options: ['SWOT', 'Porter Five Forces', 'PESTLE', 'BCG Matrix'], correctAnswer: 'Porter Five Forces', explanation: "Porter's Five Forces analyses competitive pressure in an industry." },
    { id: 'a7q3', question: 'What does PESTLE analysis examine?', type: 'choice', options: ['Personal finances', 'Political, Economic, Social, Technological, Legal, Environmental factors', 'Product sales data', 'Past expenditure trends'], correctAnswer: 'Political, Economic, Social, Technological, Legal, Environmental factors', explanation: 'PESTLE examines macro-environmental factors affecting a business.' },
    { id: 'a7q4', question: 'What is a competitive advantage?', type: 'choice', options: ['Being the cheapest always', 'A unique strength that sets a business apart from rivals', 'Having more employees', 'Paying less tax'], correctAnswer: 'A unique strength that sets a business apart from rivals', explanation: 'Competitive advantage is what makes a business better than its competitors.' },
    { id: 'a7q5', question: 'What is a mission statement?', type: 'choice', options: ['A financial target', 'A declaration of an organisations purpose and goals', 'A legal document', 'A marketing campaign'], correctAnswer: 'A declaration of an organisations purpose and goals', explanation: 'A mission statement defines why an organisation exists and what it aims to achieve.' },
  ] },
];

export const LAB_SCIENCE_MEETINGS: Meeting[] = [
  { id: 'l1', title: 'Laboratory Techniques & Safety', type: 'Workshop', time: '15:30', date: 'Mon 12 Oct', points: 15, description: 'Master pipetting, weighing, solution preparation, and standard operating procedures safely.', image: 'https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Emily Foster', duration: '90 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/ZwqLCX-TN8c', form: [
    { id: 'l1q1', question: 'What does COSHH stand for?', type: 'choice', options: ['Control of Substances Hazardous to Health', 'Care of Safety & Health Hazards', 'Chemical Operations Safety & Health', 'Certification of Safe Handling Habits'], correctAnswer: 'Control of Substances Hazardous to Health', explanation: 'COSHH is the UK regulation for controlling exposure to hazardous substances.' },
    { id: 'l1q2', question: 'Which piece of equipment measures liquid volume precisely?', type: 'choice', options: ['Beaker', 'Pipette', 'Test tube', 'Flask'], correctAnswer: 'Pipette', explanation: 'A pipette delivers precise, reproducible volumes of liquid.' },
    { id: 'l1q3', question: 'What is the purpose of a risk assessment?', type: 'choice', options: ['To speed up experiments', 'To identify hazards and minimise risks before working', 'To calculate experiment costs', 'To write the lab report'], correctAnswer: 'To identify hazards and minimise risks before working', explanation: 'Risk assessments identify potential hazards and define control measures.' },
    { id: 'l1q4', question: 'Which PPE is most commonly required in a lab?', type: 'choice', options: ['Sandals and shorts', 'Safety goggles, lab coat, and gloves', 'A hat and scarf', 'A suit and tie'], correctAnswer: 'Safety goggles, lab coat, and gloves', explanation: 'Personal Protective Equipment protects against chemical splashes and contamination.' },
    { id: 'l1q5', question: 'What should you do if a chemical spills on your skin?', type: 'choice', options: ['Ignore it', 'Rinse immediately with plenty of water and inform the supervisor', 'Wipe it with a tissue', 'Apply hand cream'], correctAnswer: 'Rinse immediately with plenty of water and inform the supervisor', explanation: 'Immediate rinsing with water dilutes the chemical. Always inform the supervisor.' },
  ] },
  { id: 'l2', title: 'Biochemistry & Biomolecules', type: 'Workshop', time: '12:15', date: 'Wed 14 Oct', points: 10, description: 'Explore carbohydrates, proteins, lipids, and nucleic acids in living organisms.', image: 'https://images.pexels.com/photos/5989943/pexels-photo-5989943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Prof. Alan Greene', duration: '60 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/H8WJ2KENlK0', form: [
    { id: 'l2q1', question: 'What are the four main types of biomolecules?', type: 'choice', options: ['Water, air, soil, fire', 'Carbohydrates, lipids, proteins, nucleic acids', 'Vitamins, minerals, salts, fibres', 'Sugar, fat, bone, blood'], correctAnswer: 'Carbohydrates, lipids, proteins, nucleic acids', explanation: 'These four biomolecule classes are the building blocks of all life.' },
    { id: 'l2q2', question: 'Which biomolecule stores genetic information?', type: 'choice', options: ['Protein', 'Lipid', 'Nucleic acid', 'Carbohydrate'], correctAnswer: 'Nucleic acid', explanation: 'Nucleic acids (DNA and RNA) store and transmit genetic information.' },
    { id: 'l2q3', question: 'What are proteins made of?', type: 'choice', options: ['Fatty acids', 'Amino acids', 'Nucleotides', 'Simple sugars'], correctAnswer: 'Amino acids', explanation: 'Proteins are chains of amino acids folded into specific 3D structures.' },
    { id: 'l2q4', question: 'What is the primary function of carbohydrates?', type: 'choice', options: ['Store genetic information', 'Provide energy', 'Build cell membranes', 'Fight infections'], correctAnswer: 'Provide energy', explanation: 'Carbohydrates are the main energy source for living organisms.' },
    { id: 'l2q5', question: 'What do lipids form in the cell?', type: 'choice', options: ['The nucleus', 'The cell membrane', 'The ribosomes', 'The DNA'], correctAnswer: 'The cell membrane', explanation: 'Lipids (phospholipids) form the bilayer structure of cell membranes.' },
  ] },
  { id: 'l3', title: 'Cell Biology & Respiration', type: 'Workshop', time: '14:00', date: 'Thu 15 Oct', points: 20, description: 'Study cell structure, the cell cycle, and cellular respiration pathways.', image: 'https://images.pexels.com/photos/18510427/pexels-photo-18510427.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Nina Kapoor', duration: '75 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/ZYUdDjyNe3o', form: [
    { id: 'l3q1', question: 'What is the function of mitochondria?', type: 'choice', options: ['Store DNA', 'Produce ATP energy', 'Synthesise proteins', 'Control cell division'], correctAnswer: 'Produce ATP energy', explanation: 'Mitochondria are the powerhouse of the cell, generating ATP via respiration.' },
    { id: 'l3q2', question: 'Which process produces ATP in cells?', type: 'choice', options: ['Photosynthesis', 'Cellular respiration', 'Mitosis', 'Diffusion'], correctAnswer: 'Cellular respiration', explanation: 'Cellular respiration converts glucose and oxygen into ATP energy.' },
    { id: 'l3q3', question: 'What are the three stages of cellular respiration?', type: 'choice', options: ['Mitosis, meiosis, cytokinesis', 'Glycolysis, Krebs cycle, electron transport chain', 'Transcription, translation, replication', 'Inhalation, exhalation, diffusion'], correctAnswer: 'Glycolysis, Krebs cycle, electron transport chain', explanation: 'Cellular respiration proceeds through glycolysis, the Krebs cycle, and the ETC.' },
    { id: 'l3q4', question: 'What is the basic unit of life?', type: 'choice', options: ['Atom', 'Molecule', 'Cell', 'Organ'], correctAnswer: 'Cell', explanation: 'The cell is the smallest structural and functional unit of all living organisms.' },
    { id: 'l3q5', question: 'What happens during mitosis?', type: 'choice', options: ['A cell divides into two identical daughter cells', 'DNA is copied for protein synthesis', 'A cell produces ATP', 'A cell engulfs a pathogen'], correctAnswer: 'A cell divides into two identical daughter cells', explanation: 'Mitosis is cell division producing two genetically identical daughter cells.' },
  ] },
  { id: 'l4', title: 'Pathogens & Immunology', type: 'Workshop', time: '10:00', date: 'Fri 16 Oct', points: 25, description: 'Understand bacteria, viruses, the immune response, and vaccination principles.', image: 'https://images.pexels.com/photos/15831822/pexels-photo-15831822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Robert Kim', duration: '120 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/_jBpv9fYSU4', form: [
    { id: 'l4q1', question: 'What is the key difference between bacteria and viruses?', type: 'choice', options: ['Bacteria are larger and can reproduce on their own; viruses need a host', 'Viruses are larger than bacteria', 'Both are the same size', 'Bacteria need a host; viruses do not'], correctAnswer: 'Bacteria are larger and can reproduce on their own; viruses need a host', explanation: 'Bacteria are living single-celled organisms. Viruses require a host cell to replicate.' },
    { id: 'l4q2', question: 'Which cells produce antibodies?', type: 'choice', options: ['Red blood cells', 'B lymphocytes', 'Platelets', 'T helper cells'], correctAnswer: 'B lymphocytes', explanation: 'B lymphocytes (B cells) produce antibodies that target pathogens.' },
    { id: 'l4q3', question: 'What is a vaccine?', type: 'choice', options: ['A cure for all diseases', 'A preparation that trains the immune system to recognise a pathogen', 'A type of antibiotic', 'A blood test'], correctAnswer: 'A preparation that trains the immune system to recognise a pathogen', explanation: 'Vaccines introduce a harmless version of a pathogen so the immune system learns to fight it.' },
    { id: 'l4q4', question: 'What is the innate immune system?', type: 'choice', options: ['The immune system you are born with that responds quickly and broadly', 'The immune system that develops after vaccination', 'A type of medication', 'A lab technique'], correctAnswer: 'The immune system you are born with that responds quickly and broadly', explanation: 'The innate immune system provides immediate, non-specific defence.' },
    { id: 'l4q5', question: 'What is an antigen?', type: 'choice', options: ['A type of antibody', 'A molecule that triggers an immune response', 'A type of white blood cell', 'A lab instrument'], correctAnswer: 'A molecule that triggers an immune response', explanation: 'An antigen is any molecule that the immune system recognises as foreign.' },
  ] },
  { id: 'l5', title: 'Analytical Techniques', type: 'Workshop', time: '16:00', date: 'Mon 19 Oct', points: 30, description: 'Learn chromatography, spectroscopy, and microscopy for chemical analysis.', image: 'https://images.pexels.com/photos/9574397/pexels-photo-9574397.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Sophia Chang', duration: '90 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/nVy5jC0-xYk', form: [
    { id: 'l5q1', question: 'What does HPLC stand for?', type: 'choice', options: ['High Pressure Liquid Chromatography', 'High Performance Liquid Chromatography', 'Heated Purified Liquid Container', 'High Precision Lab Centrifuge'], correctAnswer: 'High Performance Liquid Chromatography', explanation: 'HPLC is a powerful technique for separating and analysing mixtures.' },
    { id: 'l5q2', question: 'Which technique separates mixtures based on molecular properties?', type: 'choice', options: ['Spectroscopy', 'Chromatography', 'Titration', 'Filtration'], correctAnswer: 'Chromatography', explanation: 'Chromatography separates components based on their interaction with stationary and mobile phases.' },
    { id: 'l5q3', question: 'What does spectroscopy measure?', type: 'choice', options: ['The weight of a sample', 'How matter interacts with light/electromagnetic radiation', 'The temperature of a solution', 'The pH of a liquid'], correctAnswer: 'How matter interacts with light/electromagnetic radiation', explanation: 'Spectroscopy analyses how substances absorb, emit, or scatter light.' },
    { id: 'l5q4', question: 'What is a standard solution?', type: 'choice', options: ['A solution of unknown concentration', 'A solution of precisely known concentration', 'A type of cleaning fluid', 'A buffered solution'], correctAnswer: 'A solution of precisely known concentration', explanation: 'Standard solutions have a known concentration, used as a reference in analysis.' },
    { id: 'l5q5', question: 'Which instrument is used to view very small objects?', type: 'choice', options: ['Telescope', 'Microscope', 'Spectrometer', 'Pipette'], correctAnswer: 'Microscope', explanation: 'Microscopes magnify small objects like cells and microorganisms.' },
  ] },
  { id: 'l6', title: 'Chemical Reactions & Equations', type: 'Workshop', time: '13:00', date: 'Wed 21 Oct', points: 35, description: 'Balance equations, calculate molar concentrations, and understand reaction kinetics.', image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Prof. Henry Walsh', duration: '150 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/eBl3U-T5Nvk', form: [
    { id: 'l6q1', question: 'What does a balanced chemical equation tell you?', type: 'choice', options: ['The speed of the reaction', 'The number of atoms of each element is equal on both sides', 'The colour change', 'The temperature required'], correctAnswer: 'The number of atoms of each element is equal on both sides', explanation: 'Balancing ensures mass conservation — same atoms on both sides.' },
    { id: 'l6q2', question: 'What is the unit for molar concentration?', type: 'choice', options: ['mol/L', 'g/L', 'mL/s', 'kg/m3'], correctAnswer: 'mol/L', explanation: 'Molar concentration is measured in moles per litre (mol/L or M).' },
    { id: 'l6q3', question: 'What is an exothermic reaction?', type: 'choice', options: ['A reaction that absorbs heat', 'A reaction that releases heat', 'A reaction that produces gas', 'A reaction that needs light'], correctAnswer: 'A reaction that releases heat', explanation: 'Exothermic reactions release energy (heat) into their surroundings.' },
    { id: 'l6q4', question: 'What does pH measure?', type: 'choice', options: ['Temperature', 'Acidity or alkalinity of a solution', 'Density', 'Electrical conductivity'], correctAnswer: 'Acidity or alkalinity of a solution', explanation: 'pH measures hydrogen ion concentration on a 0-14 scale.' },
    { id: 'l6q5', question: 'What is a mole in chemistry?', type: 'choice', options: ['A small animal', 'A unit representing 6.022 x 10^23 particles', 'A type of chemical bond', 'A unit of pressure'], correctAnswer: 'A unit representing 6.022 x 10^23 particles', explanation: 'A mole is Avogadros number of particles — the SI unit for amount of substance.' },
  ] },
  { id: 'l7', title: 'Physics: Waves & Electromagnetism', type: 'Lecture', time: '11:30', date: 'Fri 23 Oct', points: 25, description: 'Study wave properties, electromagnetic fields, and their laboratory applications.', image: 'https://images.pexels.com/photos/9574403/pexels-photo-9574403.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Dr. Lisa Hammond', duration: '100 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/eBl3U-T5Nvk', form: [
    { id: 'l7q1', question: 'What is the relationship between wavelength and frequency?', type: 'choice', options: ['They are the same', 'They are inversely proportional', 'They are directly proportional', 'There is no relationship'], correctAnswer: 'They are inversely proportional', explanation: 'As wavelength increases, frequency decreases: c = wavelength x frequency.' },
    { id: 'l7q2', question: 'Which type of wave does not require a medium?', type: 'choice', options: ['Sound wave', 'Water wave', 'Electromagnetic wave', 'Seismic wave'], correctAnswer: 'Electromagnetic wave', explanation: 'Electromagnetic waves (like light) can travel through a vacuum.' },
    { id: 'l7q3', question: 'What is the speed of light in a vacuum?', type: 'choice', options: ['3 x 10^5 m/s', '3 x 10^8 m/s', '3 x 10^10 m/s', '3 x 10^3 m/s'], correctAnswer: '3 x 10^8 m/s', explanation: 'Light travels at approximately 300,000,000 m/s in a vacuum.' },
    { id: 'l7q4', question: 'What does an electromagnet consist of?', type: 'choice', options: ['A permanent magnet', 'A coil of wire with current flowing through it', 'A piece of iron only', 'A battery connected to a bulb'], correctAnswer: 'A coil of wire with current flowing through it', explanation: 'An electromagnet is created when electric current flows through a coiled conductor.' },
    { id: 'l7q5', question: 'What is refraction?', type: 'choice', options: ['Bouncing of a wave off a surface', 'Bending of a wave as it passes from one medium to another', 'Splitting of white light into colours', 'Absorption of light by a material'], correctAnswer: 'Bending of a wave as it passes from one medium to another', explanation: 'Refraction is the change in wave direction when entering a different medium.' },
  ] },
];

export const DAILY_WORKSHOPS: Meeting[] = [
  { id: 'daily-digital', title: 'Code Challenge Sprint', type: 'Daily drop', time: 'Anytime', date: 'Refreshes daily', points: 18, description: 'Solve a small coding problem and submit your approach via the online form.', image: 'https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Elevate Studio', duration: '45 min', course: 'Digital', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', form: [
    { id: 'ddq1', question: 'What is the time complexity of a single loop iterating through n items?', type: 'choice', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)', explanation: 'A single pass through the data is O(n) linear time.' },
    { id: 'ddq2', question: 'What does "DRY" stand for in programming?', type: 'choice', options: ['Do Run Yourself', 'Dont Repeat Yourself', 'Data Read Yield', 'Direct Return Year'], correctAnswer: 'Dont Repeat Yourself', explanation: 'DRY is a principle to reduce repetition in code.' },
    { id: 'ddq3', question: 'Which data structure uses FIFO (First In First Out)?', type: 'choice', options: ['Stack', 'Queue', 'Tree', 'Hash map'], correctAnswer: 'Queue', explanation: 'A queue processes items in the order they were added — first in, first out.' },
  ] },
  { id: 'daily-accounting', title: 'Numbers in Practice', type: 'Daily drop', time: 'Anytime', date: 'Refreshes daily', points: 18, description: 'Work through a short bookkeeping or costing challenge and submit your answers.', image: 'https://images.pexels.com/photos/6120214/pexels-photo-6120214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Elevate Studio', duration: '45 min', course: 'Accounting', videoUrl: 'https://www.youtube.com/embed/eyXKvOrDoqw', form: [
    { id: 'daq1', question: 'If revenue is 10,000 and costs are 7,500, what is the profit margin?', type: 'choice', options: ['25%', '75%', '33%', '50%'], correctAnswer: '25%', explanation: 'Profit = 10,000 - 7,500 = 2,500. Margin = 2,500/10,000 = 25%.' },
    { id: 'daq2', question: 'What is the journal entry for a credit sale of 500?', type: 'choice', options: ['Debit Cash 500, Credit Sales 500', 'Debit Accounts Receivable 500, Credit Sales 500', 'Debit Sales 500, Credit Cash 500', 'Debit Purchases 500, Credit Cash 500'], correctAnswer: 'Debit Accounts Receivable 500, Credit Sales 500', explanation: 'A credit sale increases receivables (debit) and revenue (credit).' },
    { id: 'daq3', question: 'What is the current ratio formula?', type: 'choice', options: ['Assets / Liabilities', 'Current Assets / Current Liabilities', 'Revenue / Expenses', 'Debt / Equity'], correctAnswer: 'Current Assets / Current Liabilities', explanation: 'The current ratio measures short-term liquidity.' },
  ] },
  { id: 'daily-lab', title: 'Lab Notes Challenge', type: 'Daily drop', time: 'Anytime', date: 'Refreshes daily', points: 18, description: 'Read a short scientific scenario and record your observations in the form.', image: 'https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', speaker: 'Elevate Studio', duration: '45 min', course: 'Lab Science', videoUrl: 'https://www.youtube.com/embed/ZwqLCX-TN8c', form: [
    { id: 'dlq1', question: 'Which pH value is considered neutral?', type: 'choice', options: ['0', '7', '14', '1'], correctAnswer: '7', explanation: 'pH 7 is neutral — neither acidic nor basic.' },
    { id: 'dlq2', question: 'What is the atomic number of carbon?', type: 'choice', options: ['4', '6', '8', '12'], correctAnswer: '6', explanation: 'Carbon has 6 protons, so its atomic number is 6.' },
    { id: 'dlq3', question: 'What is the chemical formula for water?', type: 'choice', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 'H2O', explanation: 'Water is two hydrogen atoms bonded to one oxygen atom.' },
  ] },
];

// === Python Long Course ===
// Uses the freeCodeCamp Python full course (rfscVS0vtbw, verified 49M views)
export const PYTHON_COURSE: PythonLesson[] = [
  {
    id: 'py-1',
    title: 'Getting Started with Python',
    videoId: 'rfscVS0vtbw',
    description: 'Install Python, write your first program, and understand variables and data types.',
    pausePoints: [
      { atSeconds: 420, question: 'What keyword do you use to display output in Python?', type: 'multiple-choice', options: ['console.log()', 'print()', 'echo()', 'printf()'], correctAnswer: 'print()', explanation: 'Python uses the print() function to display output.' },
      { atSeconds: 900, question: 'Which of these is a valid Python variable name?', type: 'multiple-choice', options: ['2name', 'my-var', 'student_name', 'class'], correctAnswer: 'student_name', explanation: 'Variables must start with a letter or underscore and cannot be keywords.' },
      { atSeconds: 1620, question: 'Write code to create a variable called `age` with the value 25.', type: 'code-input', correctAnswer: 'age = 25', codeStarter: '# Create a variable called age with value 25\n', explanation: 'Use the = operator: age = 25' },
    ],
  },
  {
    id: 'py-2',
    title: 'Working with Strings & Numbers',
    videoId: 'rfscVS0vtbw',
    description: 'Learn string manipulation, concatenation, and arithmetic operations.',
    pausePoints: [
      { atSeconds: 2200, question: 'How do you concatenate "Hello" and "World" with a space?', type: 'multiple-choice', options: ['"Hello" + " " + "World"', '"Hello" . "World"', 'concat("Hello", "World")', '"Hello" * "World"'], correctAnswer: '"Hello" + " " + "World"', explanation: 'Python uses + to concatenate strings.' },
      { atSeconds: 2900, question: 'What is the result of 7 // 2 in Python?', type: 'multiple-choice', options: ['3.5', '3', '4', '2'], correctAnswer: '3', explanation: '// performs floor division, returning the integer part.' },
      { atSeconds: 3500, question: 'Write code that prints `price` with 2 decimal places.', type: 'code-input', correctAnswer: 'print(f"{price:.2f}")', codeStarter: 'price = 19.99\n# Print price with 2 decimal places\n', explanation: 'Use an f-string with :.2f format specifier.' },
    ],
  },
  {
    id: 'py-3',
    title: 'Lists, Loops & Conditionals',
    videoId: 'rfscVS0vtbw',
    description: 'Master lists, for/while loops, and if/else decision logic.',
    pausePoints: [
      { atSeconds: 3900, question: 'How do you add an item to the end of a list called `fruits`?', type: 'multiple-choice', options: ['fruits.add("apple")', 'fruits.append("apple")', 'fruits.push("apple")', 'fruits.insert("apple")'], correctAnswer: 'fruits.append("apple")', explanation: 'The append() method adds an element to the end of a list.' },
      { atSeconds: 4900, question: 'What does range(5) produce?', type: 'multiple-choice', options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[5, 6, 7, 8, 9]', '[0, 1, 2, 3, 4, 5]'], correctAnswer: '[0, 1, 2, 3, 4]', explanation: 'range(5) generates 0 to 4.' },
      { atSeconds: 5800, question: 'Write a for loop that prints each item in the list `names`.', type: 'code-input', correctAnswer: 'for name in names:\n    print(name)', codeStarter: 'names = ["Alice", "Bob", "Charlie"]\n# Loop through names and print each one\n', explanation: 'Use for item in list: then print each item.' },
    ],
  },
  {
    id: 'py-4',
    title: 'Functions & Dictionaries',
    videoId: 'rfscVS0vtbw',
    description: 'Build reusable functions and store data with key-value dictionaries.',
    pausePoints: [
      { atSeconds: 6800, question: 'How do you define a function called `greet` that takes `name`?', type: 'multiple-choice', options: ['function greet(name):', 'def greet(name):', 'func greet(name):', 'def greet(name)'], correctAnswer: 'def greet(name):', explanation: 'Python uses def keyword followed by name and parameters, ending with a colon.' },
      { atSeconds: 7800, question: 'What does student["grade"] do if student is a dictionary?', type: 'multiple-choice', options: ['Adds a new key', 'Removes the grade key', 'Returns the value associated with the "grade" key', 'Returns the index of "grade"'], correctAnswer: 'Returns the value associated with the "grade" key', explanation: 'Square bracket notation retrieves the value for a given key.' },
      { atSeconds: 8500, question: 'Write a function called `square` that takes `x` and returns x squared.', type: 'code-input', correctAnswer: 'def square(x):\n    return x * x', codeStarter: '# Define a function square(x) that returns x squared\n', explanation: 'Use def and return to send back x * x.' },
    ],
  },
];

export function getCourseMeetings(course: Course): Meeting[] {
  switch (course) {
    case 'Digital': return DIGITAL_MEETINGS;
    case 'Accounting': return ACCOUNTING_MEETINGS;
    case 'Lab Science': return LAB_SCIENCE_MEETINGS;
  }
}

export function getDailyWorkshop(course: Course): Meeting {
  const workshops = DAILY_WORKSHOPS.filter((w) => w.course === course);
  return workshops[new Date().getUTCDate() % workshops.length];
}

export const CV_FORM_QUESTIONS: WorkshopForm[] = [
  { id: 'cv-name', question: 'Full name', type: 'text' },
  { id: 'cv-email', question: 'Email address', type: 'text' },
  { id: 'cv-phone', question: 'Phone number', type: 'text' },
  { id: 'cv-why', question: 'Why do you want to join this employer opportunity?', type: 'text' },
  { id: 'cv-strength', question: 'What is your strongest skill from your T Level course?', type: 'text' },
  { id: 'cv-availability', question: 'When are you available for an industry placement?', type: 'choice', options: ['Immediately', 'Within 1 month', 'Within 3 months', 'Next academic year'] },
  { id: 'cv-experience', question: 'Describe a project or challenge you are proud of.', type: 'text' },
];

export const COMPANIES: Company[] = [
  { id: 'amazon-cloud', name: 'Amazon', role: 'Cloud Software Developer Workshop', industry: 'Cloud & E-commerce', courses: ['Digital'], xpRequired: 500, tier: 'Standard', premium: false, logo: 'AM', location: 'London, UK', description: 'Explore cloud architecture and learn how technology supports products used by millions.', image: 'https://images.pexels.com/photos/7567432/pexels-photo-7567432.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'ibm-ai', name: 'IBM', role: 'AI & Data Engineering Lab', industry: 'Technology', courses: ['Digital'], xpRequired: 1500, tier: 'Advanced', premium: false, logo: 'IBM', location: 'Hursley, UK', description: 'Work through a practical AI and data challenge with an IBM-inspired problem brief.', image: 'https://images.pexels.com/photos/6120214/pexels-photo-6120214.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'cisco-networking', name: 'Cisco', role: 'Elite Software & Networking Lab', industry: 'Networking', courses: ['Digital'], xpRequired: 3000, tier: 'Premium', premium: true, logo: 'CI', location: 'Manchester, UK', description: 'A limited-capacity networking and software lab for learners ready to tackle an advanced technical scenario.', image: 'https://images.pexels.com/photos/2881233/pexels-photo-2881233.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'lloyds-finance', name: 'Lloyds Bank', role: 'Financial Services Insight Day', industry: 'Finance', courses: ['Accounting'], xpRequired: 500, tier: 'Standard', premium: false, logo: 'LL', location: 'Edinburgh, UK', description: 'See how accounting, risk, and digital banking come together in a modern financial institution.', image: 'https://images.pexels.com/photos/5716016/pexels-photo-5716016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'deloitte-audit', name: 'Deloitte', role: 'Audit & Advisory Challenge', industry: 'Professional Services', courses: ['Accounting'], xpRequired: 1500, tier: 'Advanced', premium: false, logo: 'DE', location: 'London, UK', description: 'Solve a business case and discover the thinking behind audit and advisory work.', image: 'https://images.pexels.com/photos/39190475/pexels-photo-39190475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'barclays-finance', name: 'Barclays', role: 'Future Finance Sprint', industry: 'Finance', courses: ['Accounting'], xpRequired: 3000, tier: 'Premium', premium: true, logo: 'BA', location: 'London, UK', description: 'A focused finance sprint exploring data, decisions, and the future of banking.', image: 'https://images.pexels.com/photos/7567556/pexels-photo-7567556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'polymateria-lab', name: 'Polymateria', role: 'Materials Science Research Lab', industry: 'Green Science', courses: ['Lab Science'], xpRequired: 500, tier: 'Standard', premium: false, logo: 'PO', location: 'London, UK', description: 'Explore biodegradable materials and the science helping to solve plastic waste.', image: 'https://images.pexels.com/photos/15177911/pexels-photo-15177911.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'nhs-lab', name: 'NHS', role: 'Clinical Science Careers Session', industry: 'Healthcare', courses: ['Lab Science'], xpRequired: 1500, tier: 'Advanced', premium: false, logo: 'NHS', location: 'Birmingham, UK', description: 'Meet the people behind laboratory science careers across the NHS.', image: 'https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'astrazeneca-lab', name: 'AstraZeneca', role: 'Discovery Science Experience', industry: 'Life Sciences', courses: ['Lab Science'], xpRequired: 3000, tier: 'Premium', premium: true, logo: 'AZ', location: 'Cambridge, UK', description: 'A limited-capacity discovery science experience focused on research and patient impact.', image: 'https://images.pexels.com/photos/15831822/pexels-photo-15831822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

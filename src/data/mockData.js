// Mock data for dropdowns and applications
export const countries = [
  { id: 1, name: 'United States', code: 'US' },
  { id: 2, name: 'Canada', code: 'CA' },
  { id: 3, name: 'United Kingdom', code: 'UK' },
  { id: 4, name: 'Germany', code: 'DE' },
  { id: 5, name: 'France', code: 'FR' },
];

// Cities depend on country
export const citiesByCountry = {
  1: [ // United States
    { id: 101, name: 'New York' },
    { id: 102, name: 'Los Angeles' },
    { id: 103, name: 'Chicago' },
    { id: 104, name: 'Houston' },
  ],
  2: [ // Canada
    { id: 201, name: 'Toronto' },
    { id: 202, name: 'Vancouver' },
    { id: 203, name: 'Montreal' },
  ],
  3: [ // United Kingdom
    { id: 301, name: 'London' },
    { id: 302, name: 'Manchester' },
    { id: 303, name: 'Birmingham' },
  ],
  4: [ // Germany
    { id: 401, name: 'Berlin' },
    { id: 402, name: 'Munich' },
    { id: 403, name: 'Hamburg' },
  ],
  5: [ // France
    { id: 501, name: 'Paris' },
    { id: 502, name: 'Lyon' },
    { id: 503, name: 'Marseille' },
  ],
};

export const industries = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Healthcare' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Education' },
  { id: 5, name: 'Manufacturing' },
];

// Job roles depend on industry
export const rolesByIndustry = {
  1: [ // Technology
    { id: 101, name: 'Software Engineer', minSalary: 80000 },
    { id: 102, name: 'Product Manager', minSalary: 90000 },
    { id: 103, name: 'DevOps Engineer', minSalary: 85000 },
    { id: 104, name: 'Data Scientist', minSalary: 95000 },
  ],
  2: [ // Healthcare
    { id: 201, name: 'Nurse', minSalary: 60000 },
    { id: 202, name: 'Medical Assistant', minSalary: 40000 },
    { id: 203, name: 'Healthcare Admin', minSalary: 50000 },
  ],
  3: [ // Finance
    { id: 301, name: 'Financial Analyst', minSalary: 70000 },
    { id: 302, name: 'Accountant', minSalary: 65000 },
    { id: 303, name: 'Investment Banker', minSalary: 100000 },
  ],
  4: [ // Education
    { id: 401, name: 'Teacher', minSalary: 45000 },
    { id: 402, name: 'Professor', minSalary: 70000 },
    { id: 403, name: 'Administrator', minSalary: 55000 },
  ],
  5: [ // Manufacturing
    { id: 501, name: 'Production Manager', minSalary: 65000 },
    { id: 502, name: 'Quality Engineer', minSalary: 70000 },
    { id: 503, name: 'Operations Manager', minSalary: 75000 },
  ],
};

// Experience levels
export const experienceLevels = [
  { id: 1, name: 'Entry Level (0-2 years)' },
  { id: 2, name: 'Mid Level (3-5 years)' },
  { id: 3, name: 'Senior Level (6-10 years)' },
  { id: 4, name: 'Expert Level (10+ years)' },
];

// Mock saved applications (for listing)
export const mockApplications = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    country: 'United States',
    city: 'New York',
    industry: 'Technology',
    role: 'Software Engineer',
    experience: 'Senior Level (6-10 years)',
    salary: 120000,
    status: 'submitted',
    createdAt: '2024-11-01T10:30:00Z',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    country: 'Canada',
    city: 'Toronto',
    industry: 'Finance',
    role: 'Financial Analyst',
    experience: 'Mid Level (3-5 years)',
    salary: 85000,
    status: 'draft',
    createdAt: '2024-11-03T14:20:00Z',
  },
  {
    id: 3,
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    country: 'United Kingdom',
    city: 'London',
    industry: 'Healthcare',
    role: 'Nurse',
    experience: 'Entry Level (0-2 years)',
    salary: 62000,
    status: 'submitted',
    createdAt: '2024-11-05T09:15:00Z',
  },
  {
    id: 4,
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@example.com',
    country: 'Germany',
    city: 'Berlin',
    industry: 'Technology',
    role: 'Data Scientist',
    experience: 'Expert Level (10+ years)',
    salary: 145000,
    status: 'submitted',
    createdAt: '2024-11-07T11:45:00Z',
  },
  {
    id: 5,
    firstName: 'Pierre',
    lastName: 'Dupont',
    email: 'pierre.dupont@example.com',
    country: 'France',
    city: 'Paris',
    industry: 'Education',
    role: 'Professor',
    experience: 'Senior Level (6-10 years)',
    salary: 78000,
    status: 'draft',
    createdAt: '2024-11-08T16:00:00Z',
  },
];

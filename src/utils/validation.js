import { z } from 'zod';

// Step 1 validation schema - Personal Info
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
});

// Step 2 validation schema - Location (dependent fields)
export const locationSchema = z.object({
  countryId: z.number().min(1, 'Country is required'),
  cityId: z.number().min(1, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

// Step 3 validation schema - Professional Info (dependent + conditional validation)
export const professionalInfoSchema = z.object({
  industryId: z.number().min(1, 'Industry is required'),
  roleId: z.number().min(1, 'Role is required'),
  experienceId: z.number().min(1, 'Experience level is required'),
  expectedSalary: z.number().min(1, 'Expected salary is required'),
  resume: z.string().optional(),
}).refine((data) => {
  // Custom validation: salary should be reasonable based on role
  // This will be checked with role's minSalary in the component
  return true;
}, {
  message: 'Salary validation',
});

// Complete form schema
export const completeFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...locationSchema.shape,
  ...professionalInfoSchema.shape,
});

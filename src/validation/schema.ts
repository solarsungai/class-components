import { z } from 'zod';
import countries from '../constants/countries';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const schema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .refine((val) => val[0] === val[0].toUpperCase(), 'First letter must be uppercase'),
    age: z.coerce.number().min(0, 'Age cannot be negative'),
    email: z.string().refine((value) => {
      const parts = value.split('@');
      if (parts.length !== 2) return false;
      if (parts[0].length < 1) return false;
      if (!parts[1].includes('.')) return false;
      return true;
    }, 'Invalid email'),
    gender: z.enum(['male', 'female']),
    country: z.string().refine((val) => countries.includes(val), 'Country must be from the list'),
    image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 2MB')
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Only .jpg, .jpeg and .png formats are supported'
      ),
    password: z.string().min(1, 'Password field cannot be empty'),
    confirmPassword: z.string().min(1, 'Confirmation password field cannot be empty'),
    terms: z.boolean().refine((value) => {
      return value === true;
    }, 'You should agree with the Terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export default schema;

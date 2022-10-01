import { z } from 'zod';

const NoSpaces = /^\S*$/;
const OneUppercase = /.*[A-Z].*/;
const OneLowercase = /.*[a-z].*/;
const OneNumber = /.*\d.*/;
const OneSpecialChar = /.*\W|_.*/;

export const Register = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(NoSpaces, { message: 'Must not contain spaces' })
    .regex(OneUppercase, { message: 'Must contain one uppercase letter' })
    .regex(OneLowercase, { message: 'Must contain one lowercase letter' })
    .regex(OneNumber, { message: 'Must contain one number' })
    .regex(OneSpecialChar, { message: 'Must contain one special character' })
    .min(6, { message: 'Must be at least 6 characters in length' }),
  first_name: z.string(),
  last_name: z.string(),
});

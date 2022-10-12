import { z } from 'zod';

export const PublicToken = z.object({
  institution: z.string(),
})

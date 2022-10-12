import { z } from 'zod';

export const ExchangeToken = z.object({
  public_token: z.string(),
});

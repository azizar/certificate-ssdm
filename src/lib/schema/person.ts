import { Schema, z } from 'zod';
import { EventRegisterSchema, EventSchema } from './event';

export const PersonSchema = z.object({
  pangkat: z.string(),
  identifier: z.string(),
  email: z.string().email(),
  name: z.string(),
  title: z.string(),
  userId: z.string(),
});


export type Person = z.infer<typeof PersonSchema>;

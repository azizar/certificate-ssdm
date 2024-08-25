import { z } from 'zod';

export const EventSchema = z.object({
  id: z.number({ coerce: true }).optional(),
  name: z.string().min(1),
  start_date: z.date({ coerce: true }),
  end_date: z.date({ coerce: true }),
  person_responsibility: z.string().min(1),
  qr_code: z.string().optional(),
  qr_url: z.string().optional(),
  google_docs_id: z.string().optional(),
  cert_template:
    typeof window === 'undefined' ? z.any() : z.instanceof(File).optional(),
});

export const EventRegisterSchema = z.object({
  full_name: z.string().min(1),
  identifier: z.string({ coerce: true }).min(1),
  title: z.string().optional(),
  email: z.string().email(),
});

export type Event = z.infer<typeof EventSchema>;
export type EventRegister = z.infer<typeof EventRegisterSchema>;

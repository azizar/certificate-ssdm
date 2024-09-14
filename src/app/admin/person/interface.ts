export interface PersonTableInterface {
  id: number
  identifier: string
  email: string
  name: string
  title: string
}

interface User {
  id: string
  name: string
  email: string
  emailVerified: any
  image: string
  password: any
  admin: boolean
  createdAt: string
  updatedAt: string
}

interface Certificate {
  id: number
  eventId: number
  personId: number
  status: string
  cert_url: string
  drive_url: any
  event: Event
}

interface Event {
  id: number
  name: string
  person_responsibility: string
  start_date: string
  end_date: string
  qr_code: string
  qr_url: string
  template_file: string
  google_docs_id: string
}

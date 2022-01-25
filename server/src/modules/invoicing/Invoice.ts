import { Client } from '../clients/Client'

export interface Invoice {
  id: string
  client: Client
  invoiceId: string
  invoiceDate: Date
  dueDate: Date
  details: {
    description: string
    price: number
  }[]
  totalExclVat: number
  totalInclVat: number
  vatAmount: number
}

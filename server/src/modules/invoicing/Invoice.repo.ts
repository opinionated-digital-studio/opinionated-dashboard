import { pipe } from 'fp-ts/lib/function'
import { moneybirdRequest } from '../../moneybird'
import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { Invoice } from './Invoice'
import { DateFromISOString, NumberFromString } from 'io-ts-types'
import { decodeTE } from '../../common/decoder'

const MoneybirdInvoice = t.type({
  id: t.string,
  administration_id: t.string,
  contact_id: t.string,
  contact: t.type({
    id: t.string,
    administration_id: t.string,
    company_name: t.string,
    firstname: t.union([t.null, t.string]),
    address1: t.string,
    zipcode: t.string,
    city: t.string,
    country: t.string,
    phone: t.string
  }),
  contact_person: t.type({
    id: t.string,
    administration_id: t.string,
    firstname: t.string,
    lastname: t.string,
    phone: t.string,
    email: t.union([t.null, t.string]),
    department: t.string,
    created_at: t.string,
    updated_at: t.string
  }),
  invoice_id: t.string,
  invoice_date: DateFromISOString,
  due_date: DateFromISOString,
  payment_conditions: t.string,
  payment_reference: t.string,
  reference: t.string,
  total_price_excl_tax: NumberFromString,
  total_price_incl_tax: NumberFromString,
  tax_totals: t.array(
    t.type({
      tax_amount: NumberFromString
    })
  ),
  details: t.array(
    t.type({
      description: t.string,
      price: NumberFromString
    })
  )
})

type MoneybirdInvoice = t.TypeOf<typeof MoneybirdInvoice>

const toDomain = (m: MoneybirdInvoice): Invoice => ({
  id: m.id,
  invoiceId: m.invoice_id,
  invoiceDate: m.invoice_date,
  dueDate: m.due_date,
  totalExclVat: m.total_price_excl_tax,
  totalInclVat: m.total_price_incl_tax,
  vatAmount: m.tax_totals.reduce((acc, curr) => curr.tax_amount + acc, 0),
  details: m.details.map((detail) => ({
    description: detail.description,
    price: detail.price
  })),
  client: {
    id: m.contact_person.id,
    firstName: m.contact_person.firstname,
    lastName: m.contact_person.lastname,
    email: m.contact_person.email || undefined,
    companyName: m.contact.company_name,
    streetAddress: m.contact.address1,
    postcode: m.contact.zipcode,
    city: m.contact.city,
    country: m.contact.country
  }
})

export const getInvoiceByInvoiceNumber = (invoiceNumber: string) =>
  pipe(
    moneybirdRequest('/sales_invoices/find_by_invoice_id/' + invoiceNumber),
    TE.map((response) => response.data),
    TE.chainW(decodeTE(MoneybirdInvoice)),
    TE.map(toDomain)
  )

import fs from 'fs'
import path from 'path'
import { Invoice } from './Invoice'
import { render } from '../../view-engine'

const invoiceTemplate = render(
  fs.readFileSync(path.join(__dirname, 'Invoice.template.njk'), 'utf-8')
)

export const renderInvoice = (invoice: Invoice) => invoiceTemplate(invoice)

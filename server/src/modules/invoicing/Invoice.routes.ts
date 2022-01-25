import { Router } from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import { getInvoiceByInvoiceNumber } from './Invoice.repo'
import { renderInvoice } from './Invoice.view'

const invoiceRouter = Router()

invoiceRouter.get('/:invoiceId', (req, res) => {
  const { invoiceId } = req.params

  return pipe(
    invoiceId,
    getInvoiceByInvoiceNumber,
    TE.map(renderInvoice),
    TE.matchW(
      (err) => res.status(500).send(err),
      (invoice) => res.send(invoice)
    )
  )()
})

export { invoiceRouter }

import express from 'express'
import { invoiceRouter } from './modules/invoicing/Invoice.routes'
import path from 'path'

const app = express()
const port = 3000

app.use(express.json())

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use('/invoices', invoiceRouter)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

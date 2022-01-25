import { tryCatch } from 'fp-ts/lib/TaskEither'
import puppeteer from 'puppeteer'

interface PdfGenerationError {
  _tag: 'PdfGenerationError'
}

const toPdfGenerationError = (e?: unknown): PdfGenerationError => {
  console.error(e)
  return {
    _tag: 'PdfGenerationError'
  }
}

export const generatePdf = (html: string) =>
  tryCatch(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'a4'
    })

    return pdf
  }, toPdfGenerationError)

import { format } from 'date-fns'
import numeral from 'numeral'
import nunjucks from 'nunjucks'
import locale from 'date-fns/locale/nl'

const viewEngine = new nunjucks.Environment()

numeral.register('locale', 'nl2', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'mln',
    billion: 'mrd',
    trillion: 'bln'
  },
  ordinal: function (number) {
    const remainder = number % 100
    return (number !== 0 && remainder <= 1) ||
      remainder === 8 ||
      remainder >= 20
      ? 'ste'
      : 'de'
  },
  currency: {
    symbol: '€ '
  }
})

viewEngine.addFilter('formatPostcode', (postcode: string) => {
  const firstLetter = postcode.match(/[a-zA-Z]/)?.pop()
  if (firstLetter) {
    const firstLetterIdx = postcode.indexOf(firstLetter)
    const formatted = [
      postcode.slice(0, firstLetterIdx),
      ' ',
      postcode.slice(firstLetterIdx)
    ].join('')

    return formatted
  }
  return postcode
})

viewEngine.addFilter('formatDate', (date: Date) => {
  return format(date, 'd MMMM yyyy', {
    locale
  })
})

viewEngine.addFilter('formatPrice', (price: number) => {
  numeral.locale('nl2')
  return numeral(price).format('0,0.00')
})

export const render =
  (template: string) =>
  <A extends object>(context: A) =>
    viewEngine.renderString(template, context)

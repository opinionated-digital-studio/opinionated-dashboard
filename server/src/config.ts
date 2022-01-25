import { config } from 'dotenv'

config()

export const moneybirdConfig = {
  apiKey: process.env.MONEYBIRD_API_KEY || '',
  administrationId: process.env.MONEYBIRD_ADMINISTRATION_ID || ''
}

if (
  moneybirdConfig.apiKey.length <= 0 ||
  moneybirdConfig.administrationId.length <= 0
) {
  throw new Error('Incomplete moneybird config')
}

import axios, { AxiosRequestConfig } from 'axios'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import { moneybirdConfig } from './config'

interface MoneybirdOptions {
  apiKey: string
  administrationId: string
}

export const makeAuthHeader = (options: MoneybirdOptions) =>
  'Bearer ' + options.apiKey

export const makeBaseUrl = (options: MoneybirdOptions) =>
  'https://moneybird.com/api/v2/' + options.administrationId

export interface MoneybirdError {
  _tag: 'MoneybirdError'
  message: string
}

export interface UnknownAxiosError {
  _tag: 'UnknownAxiosError'
}

const toMoneybirdError = (message: string): MoneybirdError => ({
  _tag: 'MoneybirdError',
  message
})

const toUnknownAxiosError = (e?: unknown): UnknownAxiosError => {
  console.error(e)
  return {
    _tag: 'UnknownAxiosError'
  }
}

const parseAxiosError = (e: unknown) => {
  return pipe(
    e,
    O.fromPredicate(axios.isAxiosError),
    O.map((res) => res.message),
    O.foldW(toUnknownAxiosError, toMoneybirdError)
  )
}

const makeMoneybirdRequest =
  (config: MoneybirdOptions) =>
  (path: string, options?: AxiosRequestConfig) => {
    const url = makeBaseUrl(config) + path + '.json'
    const headers = {
      Authorization: makeAuthHeader(config)
    }
    const method = options?.method || 'get'

    return TE.tryCatch(
      () => axios({ url, method, headers, ...options }),
      parseAxiosError
    )
  }

export const moneybirdRequest = makeMoneybirdRequest(moneybirdConfig)

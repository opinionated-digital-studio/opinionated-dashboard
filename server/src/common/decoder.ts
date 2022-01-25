import { flow, pipe } from 'fp-ts/lib/function'
import { Errors, Props, TypeC } from 'io-ts'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { formatValidationErrors } from 'io-ts-reporters'

interface DecodingError {
  _tag: 'DecodingError'
  message: string[]
}

export const toDecodingError = (err: Errors): DecodingError =>
  pipe(err, formatValidationErrors, (errors) => ({
    _tag: 'DecodingError',
    message: errors
  }))

export const decode = <A extends Props>(decoder: TypeC<A>) =>
  flow(decoder.decode, E.mapLeft(toDecodingError))

export const decodeTE = <A extends Props>(decoder: TypeC<A>) =>
  flow(decode(decoder), TE.fromEither)

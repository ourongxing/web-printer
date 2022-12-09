type MaybePromise<T> = Promise<T> | T
type MaybeArray<T> = Array<T> | T

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

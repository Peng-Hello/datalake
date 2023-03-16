export interface ServerException {
  message: string
  cause: ServerException | null
}

export interface GetCurrentUserPortOutput {
  userId: string
}

export interface GetCurrentUserPort {
  handle(): Promise<GetCurrentUserPortOutput>
}

export const GetCurrentUserPortToken = Symbol("GetCurrentUserPort")

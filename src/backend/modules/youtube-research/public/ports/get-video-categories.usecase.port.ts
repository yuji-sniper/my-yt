export interface GetVideoCategoriesUseCasePortInput {
  regionCode: string
}

export interface GetVideoCategoriesResultItem {
  categoryId: string
  title: string
}

export interface GetVideoCategoriesUseCasePortOutput {
  items: GetVideoCategoriesResultItem[]
}

export interface GetVideoCategoriesUseCasePort {
  handle(
    input: GetVideoCategoriesUseCasePortInput
  ): Promise<GetVideoCategoriesUseCasePortOutput>
}

export const GetVideoCategoriesUseCasePortToken = Symbol(
  "GetVideoCategoriesUseCasePort"
)

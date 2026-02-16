export interface GetVideoCategoriesResultItem {
  categoryId: string
  title: string
}

export interface GetVideoCategoriesUseCasePortOutput {
  items: GetVideoCategoriesResultItem[]
}

export interface GetVideoCategoriesUseCasePort {
  handle(): Promise<GetVideoCategoriesUseCasePortOutput>
}

export const GetVideoCategoriesUseCasePortToken = Symbol(
  "GetVideoCategoriesUseCasePort"
)

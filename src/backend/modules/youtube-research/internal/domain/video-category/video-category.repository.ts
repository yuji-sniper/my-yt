export interface VideoCategoryRecord {
  categoryId: string
  title: string
  regionCode: string
  assignable: boolean
  fetchedAt: Date
}

export interface VideoCategoryUpsertInput {
  id: string
  categoryId: string
  title: string
  regionCode: string
  assignable: boolean
  fetchedAt: Date
}

export const VideoCategoryRepositoryToken = Symbol("VideoCategoryRepository")

export interface VideoCategoryRepository {
  findByRegionCode(regionCode: string): Promise<VideoCategoryRecord[]>
  upsertMany(categories: VideoCategoryUpsertInput[]): Promise<void>
}

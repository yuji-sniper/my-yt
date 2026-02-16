"use client"

import { useQuery } from "@tanstack/react-query"
import { getVideoCategoriesQuery } from "../../queries/get-video-categories"
import { videoCategoriesKey } from "../../queries/keys"

export const useGetVideoCategoriesQuery = () => {
  return useQuery({
    queryKey: videoCategoriesKey(),
    queryFn: () => getVideoCategoriesQuery(),
    staleTime: 1000 * 60 * 60 // 1 hour
  })
}

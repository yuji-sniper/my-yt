import type { DependencyContainer } from "tsyringe"
import { initInfrastructureDependency } from "./infrastructure.di"

export const initYoutubeResearchDependency = (
  container: DependencyContainer
) => {
  initInfrastructureDependency(container)
}

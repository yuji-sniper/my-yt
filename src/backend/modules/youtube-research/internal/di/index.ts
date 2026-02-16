import type { DependencyContainer } from "tsyringe"
import { initApplicationDependency } from "./application.di"
import { initInfrastructureDependency } from "./infrastructure.di"
import { initPresentationDependency } from "./presentation.di"

export const initYoutubeResearchDependency = (
  container: DependencyContainer
) => {
  initInfrastructureDependency(container)
  initApplicationDependency(container)
  initPresentationDependency(container)
}

import { chromium } from "playwright"
import { projectRoot } from "."
export async function launchPersistentContext() {
  const extensionPath = await projectRoot("assets/stylus")
  return await chromium.launchPersistentContext(
    await projectRoot("assets/userData"),
    {
      headless: false,
      args: [`--disable-extensions-except=${extensionPath}`]
    }
  )
}

import path from "path"
import { chromium } from "playwright"
const extensionPath = path.join(__dirname, "../../assets/stylus")
export async function launchPersistentContext() {
  return await chromium.launchPersistentContext(
    path.join(__dirname, "../../assets/userData"),
    {
      headless: false,
      args: [`--disable-extensions-except=${extensionPath}`]
    }
  )
}

declare module "custom-env" {
  /**

   * Load environment variables from .env files.

   * @param env Optional environment name (e.g. "test")

   */

  export function env(env?: string): void;
}

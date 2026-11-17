import { onMounted, onUnmounted } from 'vue'

export const VERSION_ENDPOINT = '/version.json'
export const RELOAD_GUARD_KEY = 'qbit-client:update-reloaded'

export interface UpdateCheckerDeps {
  currentVersion: string
  fetchVersion?: () => Promise<string | null>
  reload?: () => void
  storage?: Pick<Storage, 'getItem' | 'setItem'>
}

export const fetchDeployedVersion = async (): Promise<string | null> => {
  try {
    const response = await fetch(VERSION_ENDPOINT, { cache: 'no-store' })

    if (!response.ok) return null

    const payload = (await response.json()) as { version?: unknown }

    return typeof payload.version === 'string' && payload.version !== '' ? payload.version : null
  } catch {
    return null
  }
}

const readGuard = (storage: UpdateCheckerDeps['storage']) => {
  try {
    return storage?.getItem(RELOAD_GUARD_KEY) ?? null
  } catch {
    return null
  }
}

const writeGuard = (storage: UpdateCheckerDeps['storage'], version: string) => {
  try {
    storage?.setItem(RELOAD_GUARD_KEY, version)
  } catch {
    // storage can be unavailable (private mode, disabled cookies) - the guard is best effort
  }
}

export const createUpdateChecker = ({
  currentVersion,
  fetchVersion = fetchDeployedVersion,
  reload = () => window.location.reload(),
  storage = window.sessionStorage,
}: UpdateCheckerDeps) => {
  let checking = false

  const check = async () => {
    if (checking) return false

    checking = true

    try {
      const deployedVersion = await fetchVersion()

      if (!deployedVersion || deployedVersion === currentVersion) return false

      // a reload that does not change the running version means something else is
      // still cached - do not loop, wait for the next deploy instead
      if (readGuard(storage) === deployedVersion) return false

      writeGuard(storage, deployedVersion)
      reload()

      return true
    } finally {
      checking = false
    }
  }

  return { check }
}

export type UseUpdateCheckDeps = Partial<Omit<UpdateCheckerDeps, 'currentVersion'>>

/**
 * Reloads the app when a newer build has been deployed. `launch_handler:
 * navigate-existing` means an installed app resumes without navigating, so the
 * check runs once the page has loaded and again whenever the app becomes visible.
 */
export const useUpdateCheck = (deps: UseUpdateCheckDeps = {}) => {
  const checker = createUpdateChecker({ ...deps, currentVersion: __APP_VERSION__ })

  const check = () => {
    checker.check()
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') check()
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange)

    // reloading while the first document is still loading is ignored by Chromium
    if (document.readyState === 'complete') {
      check()
      return
    }

    window.addEventListener('load', check, { once: true })
  })

  onUnmounted(() => {
    window.removeEventListener('load', check)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return checker
}

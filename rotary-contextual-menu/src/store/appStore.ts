import { create } from "zustand"
import { AppAction, Application } from "../components/Application.tsx"
import { apps } from "../list-of-apps.ts"

type AppStoreState = {
    apps: Application[]
    action?: AppAction
    activeAppId: Application["id"] | null
}

type AppStoreAction = {
    /** Set list of apps */
    setApps: (apps: Application[]) => void
    /** Set the selected app */
    selectApp: (appId: Application["id"]) => void
    /** Set the action of the selected app (if there is one) */
    selectAction: (action: AppAction) => void
    /** Clear selection */
    clearSelection: () => void

    /** Get the app from the current state */
    getActiveApp: () => Application | null
}

type AppStore = AppStoreState & AppStoreAction

const useAppStore = create<AppStore>((set, get) => ({
    apps: apps,
    activeAppId: null,

    setApps: (apps: Application[]): void => set({ apps }),

    selectApp: (appId: Application["id"]): void => {
        set({ activeAppId: appId })
    },

    selectAction: (action: AppAction): void => {
        set({ action })
    },

    clearSelection: (): void => {
        set({ activeAppId: null })
    },
    getActiveApp: (): Application | null => {
        const { activeAppId, apps } = get()
        return apps.find((app) => app.id === activeAppId || null)!
    },
}))

export default useAppStore

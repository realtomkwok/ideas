import { create } from "zustand"
import { Application } from "../components/Application.tsx"
import { apps } from "../list-of-apps.ts"

type AppStoreState = {
    apps: Application[]
    activeAppId: Application["id"] | null
}

type AppStoreAction = {
    /** Set list of apps */
    setApps: (apps: Application[]) => void
    /** Set the selected app */
    selectApp: (appId: Application["id"]) => void
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

        const { activeAppId, apps } = get()

        const selectedApp = apps.find((app) => app.id === activeAppId)

        if (selectedApp) {
            console.log(`App selected: ${selectedApp.name}`)
        }
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

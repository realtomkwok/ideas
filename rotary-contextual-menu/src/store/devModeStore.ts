import { create } from "zustand"

type DevModeState = {
    devMode: boolean
}

type DevModeAction = {
    setDevMode: () => void
}

type DevModeStore = DevModeState & DevModeAction

const useDevModeStore = create<DevModeStore>((set, get) => ({
    devMode: false,
    setDevMode: () => {
        const { devMode } = get()
        set({ devMode: !devMode })
    },
}))

export default useDevModeStore

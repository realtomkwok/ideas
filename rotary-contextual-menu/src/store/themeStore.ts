import { create } from "zustand"
import { persist } from "zustand/middleware"

type themeType = "light" | "dark"
type contrastLevel = "standard" | "medium" | "high"

type themeState = {
    theme: themeType
    contrast: contrastLevel
    useSystemTheme: boolean
}

type themeActions = {
    setTheme: (theme: themeType) => void
    setContrast: (contrast: contrastLevel) => void
    setUseSystemTheme: (useSystemTheme: boolean) => void
    applyTheme: () => void
}

type themeStore = themeState & themeActions

export const useThemeStore = create<themeStore>()(
    persist(
        (set, get) => ({
            theme: "light",
            contrast: "standard",
            useSystemTheme: true,

            setTheme: (theme) => {
                set({ theme, useSystemTheme: false })
                get().applyTheme()
            },

            setContrast: (contrast) => {
                set({ contrast })
                get().applyTheme()
            },

            setUseSystemTheme: (useSystemTheme) => {
                set({ useSystemTheme })
                get().applyTheme()
            },

            applyTheme: () => {
                const { theme, contrast, useSystemTheme } = get()

                // Initialize and remove all theme classes
                document.documentElement.classList.remove(
                    "light",
                    "dark",
                    "light-medium-contrast",
                    "dark-medium-contrast",
                    "light-high-contrast",
                    "dark-high-contrast"
                )

                // Determine theme
                let activeTheme = theme
                // Add a listener for the `matchMedia`

                if (useSystemTheme) {
                    activeTheme = window.matchMedia(
                        "(prefers-color-scheme: light)"
                    ).matches
                        ? "light"
                        : "dark"
                }

                // Apply theme class
                if (activeTheme === "light") {
                    document.documentElement.classList.add("light")
                    if (contrast === "medium")
                        document.documentElement.classList.add(
                            "light-medium-contrast"
                        )
                    if (contrast === "high")
                        document.documentElement.classList.add(
                            "light-high-contrast"
                        )
                } else {
                    document.documentElement.classList.add("dark")
                    if (contrast === "medium")
                        document.documentElement.classList.add(
                            "dark-medium-contrast"
                        )
                    if (contrast === "high")
                        document.documentElement.classList.add(
                            "dark-high-contrast"
                        )
                }
            },
        }),
        {
            name: "theme-storage",
        }
    )
)

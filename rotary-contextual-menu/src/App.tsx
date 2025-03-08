import "./App.css"
import useAppStore from "./store/appStore.ts"
import { Application } from "./components/Application.tsx"
import { motion } from "motion/react"
import { transition } from "./libs/motionUtils.ts"
import { useEffect, useState } from "react"
import { useThemeStore } from "./store/themeStore.ts"

// Theme initializer component
const ThemeInitializer: React.FC = () => {
    const applyTheme = useThemeStore((state) => state.applyTheme)

    // Apply theme on mount
    useEffect(() => {
        applyTheme()
    }, [applyTheme])

    return null // This component doesn't render anything
}

const Drawer: React.FC = () => {
    const apps = useAppStore((state) => state.apps)
    const selectedAppId = useAppStore((state) => state.activeAppId)
    const [showScrim, setShowScrim] = useState(false)

    useEffect(() => {
        if (selectedAppId) {
            setShowScrim(true)
        } else {
            setShowScrim(false)
        }
    }, [selectedAppId])

    return (
        <div className="drawer">
            <div className="apps">
                {apps.map((app) => (
                    <Application
                        key={app.id}
                        id={app.id}
                        name={app.name}
                        icon={app.icon}
                        actions={app.actions}
                    />
                ))}
            </div>
            <motion.div
                className="scrim"
                initial={{ visibility: "hidden" }}
                animate={
                    showScrim
                        ? {
                              visibility: "visible",
                              opacity: 0.32,
                              backdropFilter: "blur(10px)",
                              transition: transition.enter,
                          }
                        : {
                              visibility: "hidden",
                              opacity: 0,
                              transition: transition.exit,
                          }
                }
            />
        </div>
    )
}

function App() {
    return (
        <div className="home">
            {/* Initialize theme */}
            <ThemeInitializer />

            <div className="modal">
                <h1>Rotary Contextual Menu</h1>
                <p>Long press the app icons to activate the contextual menu.</p>
            </div>
            <Drawer />
        </div>
    )
}

export default App

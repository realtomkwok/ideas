import "./App.css"
import useAppStore from "./store/appStore.ts"
import { Application } from "./components/Application.tsx"
import { motion } from "motion/react"
import { transition } from "./libs/motionUtils.ts"
import { useEffect, useState } from "react"

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
                initial={{ display: "none" }}
                animate={
                    showScrim
                        ? {
                              display: "block",
                              opacity: 0.4,
                              transition: transition.enter,
                          }
                        : {
                              display: "none",
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
            <Drawer />
        </div>
    )
}

export default App

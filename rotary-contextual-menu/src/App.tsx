import "./App.css"
// import { Application } from "./components/Application.tsx"
import useAppStore from "./store/appStore.ts"
import { motion } from "motion/react"
import { Application } from "./components/Application.tsx"
import useDevModeStore from "./store/devModeStore.ts"

const Drawer: React.FC = () => {
    const apps = useAppStore((state) => state.apps)
    const activeAppId = useAppStore((state) => state.activeAppId)

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
                animate={
                    activeAppId
                        ? { display: "block", opacity: 0.4 }
                        : { display: "none", opacity: 0 }
                }
            />
        </div>
    )
}

function App() {
    const activeAppId = useAppStore((state) => state.activeAppId)
    const devMode = useDevModeStore((state) => state.devMode)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Drawer />
            <p style={{ zIndex: 200 }}>Current app: {activeAppId} </p>
            <p>Dev Mode: {devMode ? "on" : "off"}</p>
        </div>
    )
}

export default App

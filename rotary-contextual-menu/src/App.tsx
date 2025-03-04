import "./App.css"
import { Application } from "./components/Application.tsx"
import useAppStore from "./store/appStore.ts"
import { motion } from "motion/react"

const Drawer: React.FC = () => {
    const apps = useAppStore((state) => state.apps)
    const activeAppId = useAppStore((state) => state.activeAppId)

    return (
        <>
            <p>Current app: {activeAppId} </p>
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
        </>
    )
}

function App() {
    return (
        <div>
            <Drawer />
        </div>
    )
}

export default App

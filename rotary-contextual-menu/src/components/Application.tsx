import { Button } from "./Button.tsx"
import { SymbolCodepoints } from "react-material-symbols"
import { FC, useState, useRef, useEffect } from "react"
import { motion } from "motion/react"
import useAppStore from "../store/appStore.ts"
import styles from "./Application.module.css"

export interface Application {
    id: string
    name: string
    icon: SymbolCodepoints
    actions: AppAction[]
}

export interface AppAction {
    label: string
    icon?: SymbolCodepoints
    img?: string
}

const AppAction: FC<AppAction & { position: { x: number; y: number } }> = ({
    label,
    icon,
    img,
    position,
}) => {
    return (
        <motion.div
            className={styles["action-wrapper"]}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "translate(-50%, -50%)",
            }}
        >
            {img ? (
                <div className="btn-wrapper">
                    <img src={img} alt={label} />
                </div>
            ) : (
                <Button
                    type="action"
                    id={`action-${label}`}
                    label={label}
                    icon={{ name: icon! }}
                    size="small"
                />
            )}
        </motion.div>
    )
}

export const Application: FC<Application> = ({ id, name, icon, actions }) => {
    const selectApp = useAppStore((state) => state.selectApp)
    const clearSelection = useAppStore((state) => state.clearSelection)
    const appRef = useRef<HTMLDivElement>(null)
    const [showActions, setShowActions] = useState(false)
    const [actionPositions, setActionPositions] = useState<
        Array<{ x: number; y: number }>
    >([])

    // Calculate positions of actions in a ring around the central button
    useEffect(() => {
        if (showActions && appRef.current && actions.length > 0) {
            const radius = 120 // Distance from center in pixels

            const positions = actions.map((_, index) => {
                // Calculate the angle for this item (in radians)
                const angle = (index * 2 * Math.PI) / 3 / actions.length

                // Calculate x and y position
                const x = radius * Math.cos(angle)
                const y = radius * Math.sin(angle) * -1

                return { x, y }
            })

            setActionPositions(positions)
        }
    }, [showActions, actions])

    function handleOnTapStart(appId: Application["id"]) {
        setTimeout(() => {
            setShowActions(true)
        }, 500)
        selectApp(appId)
    }

    function handleCancelTap() {
        clearSelection()
        setShowActions(false)
    }

    return (
        <div className={styles.wrapper}>
            <motion.div
                ref={appRef}
                className={styles["app-container"]}
                whileTap={{ scale: 1.2, zIndex: 100 }}
                onTapStart={() => handleOnTapStart(id)}
                onTap={() => handleCancelTap()}
                onTapCancel={() => handleCancelTap()}
                style={{ position: "relative" }}
            >
                <Button
                    type="application"
                    id={`app_${id}`}
                    label={name}
                    icon={{ name: icon }}
                    size="large"
                />

                {showActions &&
                    actions.map((action, index) => (
                        <AppAction
                            key={`${id}-action-${index}`}
                            label={action.label}
                            icon={action.icon}
                            img={action.img}
                            position={actionPositions[index] || { x: 0, y: 0 }}
                        />
                    ))}
            </motion.div>
        </div>
    )
}

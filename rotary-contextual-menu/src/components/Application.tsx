import { Button } from "./Button.tsx"
import { SymbolCodepoints } from "react-material-symbols"
import { FC, useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import useAppStore from "../store/appStore.ts"
import styles from "./Application.module.css"
import useDevModeStore from "../store/devModeStore.ts"

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
            className={styles["action-container"]}
            initial={{
                opacity: 0,
                scale: 0.5,
            }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                translateX: `-50%`,
                translateY: `-50%`,
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
    const [showActions, setShowActions] = useState(true)
    const [actionPositions, setActionPositions] = useState<
        Array<{ x: number; y: number }>
    >([])

    const devMode = useDevModeStore((state) => state.devMode)
    const setDevMode = useDevModeStore((state) => state.setDevMode)

    // Radius control - distance between the app and its actions in pixels
    const [radius, setRadius] = useState(80)

    // Scope control - how much of the circle to use for actions
    // Changed default to use a half circle at the bottom (π to 2π)
    const [scopeRadians, setScopeRadians] = useState(Math.PI)

    // Start angle offset (θ) - where the first item should be positioned
    const [startAngle, setStartAngle] = useState(-45)

    // Listen to ref element's dimensions for accurate positions of App Actions
    const [refDimensions, setRefDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateRefDimensions = () => {
            if (appRef.current) {
                const rect = appRef.current.getBoundingClientRect()

                setRefDimensions({
                    width: rect.width,
                    height: rect.height,
                })
            }
        }

        updateRefDimensions()

        // Listen to window resize
        window.addEventListener("resize", updateRefDimensions)

        return () => window.removeEventListener("resize", updateRefDimensions)
    }, [])

    // Toggle debug mode with key press
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "d" || e.key === "D") {
                setDevMode()
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [devMode])

    // Calculate positions of actions in a ring around the central button
    useEffect(() => {
        if (showActions && appRef.current && actions.length > 0) {
            const positions = actions.map((_, index) => {
                // Use half dimensions for the center point
                const centerX = refDimensions.width / 2
                const centerY = refDimensions.height / 2

                const angleRadians = (startAngle * Math.PI) / 2

                // Calculate the angle for this item (in radians)
                const angle =
                    angleRadians +
                    (index * scopeRadians) /
                        (actions.length > 1 ? actions.length - 1 : 1)

                const x = centerX + radius * Math.cos(angle)
                const y = centerY + radius * Math.sin(angle)

                console.log(
                    `Action ${index} - ${_.label}: (${x}, ${y}) at angle ${angle} rad`
                )

                return { x, y }
            })

            setActionPositions(positions)
        }
    }, [showActions, actions, scopeRadians, startAngle, refDimensions, radius])

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
        <motion.div
            ref={appRef}
            className={styles["app-container"]}
            whileTap={{ zIndex: 100 }}
            onTapStart={() => handleOnTapStart(id)}
            onTap={() => handleCancelTap()}
            onTapCancel={() => handleCancelTap()}
        >
            <Button
                type="application"
                id={`app_${id}`}
                label={name}
                icon={{ name: icon }}
                size="large"
            />

            {!devMode ||
                (showActions &&
                    actions.map((action, index) => (
                        <AppAction
                            key={`${id}-action-${index}`}
                            label={action.label}
                            icon={action.icon}
                            img={action.img}
                            position={actionPositions[index] || { x: 0, y: 0 }}
                        />
                    )))}

            {/* Information */}

            {devMode && (
                <div
                    style={{
                        position: "absolute",
                        top: "200px",
                        left: "200px",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "5px",
                        borderRadius: "3px",
                        fontSize: "12px",
                        width: "200px",
                        zIndex: 1000,
                    }}
                >
                    <div>
                        Dimensions: {Math.round(refDimensions.width)}×
                        {Math.round(refDimensions.height)}
                    </div>
                    <div>
                        Center: ({Math.round(refDimensions.width / 2)},{" "}
                        {Math.round(refDimensions.height / 2)})
                    </div>
                    <div>
                        Start Angle: {(startAngle / Math.PI).toFixed(2)}π (
                        {Math.round((startAngle * 180) / Math.PI)}°)
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={startAngle}
                            onChange={(e) =>
                                setStartAngle(parseInt(e.target.value))
                            }
                        />
                    </div>
                    <div>
                        Scope: {(scopeRadians / Math.PI).toFixed(2)}π (
                        {Math.round((scopeRadians * 180) / Math.PI)}°)
                        <input
                            type="range"
                            min="0.25"
                            max="2"
                            step="0.25"
                            value={scopeRadians / Math.PI}
                            onChange={(e) =>
                                setScopeRadians(
                                    parseFloat(e.target.value) * Math.PI
                                )
                            }
                        />
                    </div>
                    <div>
                        Radius: {radius}px
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={radius}
                            onChange={(e) =>
                                setRadius(parseInt(e.target.value))
                            }
                        />
                    </div>
                </div>
            )}

            {/* Center point debug indicator */}
            {devMode && (
                <div
                    style={{
                        position: "absolute",
                        width: "10px",
                        height: "10px",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        top: `${refDimensions.height / 2}px`,
                        left: `${refDimensions.width / 2}px`,
                        transform: "translate(-50%, -50%)",
                        zIndex: 999,
                    }}
                />
            )}

            {/* Circle radius indicator */}
            {devMode && (
                <div
                    style={{
                        position: "absolute",
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        border: "1px dashed rgba(255,0,0,0.5)",
                        borderRadius: "50%",
                        top: `${refDimensions.height / 2}px`,
                        left: `${refDimensions.width / 2}px`,
                        transform: "translate(-50%, -50%)",
                        zIndex: 998,
                    }}
                />
            )}
        </motion.div>
    )
}

import { Button } from "./Button.tsx"
import { SymbolCodepoints } from "react-material-symbols"
import { FC, useEffect, useRef, useState } from "react"
import { motion, Variants } from "motion/react"
import useAppStore from "../store/appStore.ts"
import styles from "./Application.module.css"
import useDevModeStore from "../store/devModeStore.ts"
import { duration, easing } from "../libs/motionUtils.ts"

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
    const motionVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    }

    return (
        <motion.div
            className={styles["action-container"]}
            variants={motionVariants}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                translateX: `-50%`,
                translateY: `-50%`,
            }}
            onPointerEnter={() => console.log("pointer enter")}
            onPointerLeave={() => console.log("pointer leave")}
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
                    role="secondary"
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

    const devMode = useDevModeStore((state) => state.devMode)
    const setDevMode = useDevModeStore((state) => state.setDevMode)

    // Radius - distance between the app and its actions in pixels
    const radius = 80

    // Scope control - how much of the circle to use for actions
    // Changed default to use a half circle at the bottom (π to 2π)
    const [scopeRadians, setscopeRadians] = useState(Math.PI / 1.5)

    // Start angle offset (θ) - where the first item should be positioned
    const [startAngle, setStartAngle] = useState(-45)

    // Listen to ref element's dimensions for accurate positions of App Actions
    const [refDimensions, setRefDimensions] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    const activeAppId = useAppStore((state) => state.activeAppId)
    const isActive = id === activeAppId

    useEffect(() => {
        const updateRefDimensions = () => {
            if (appRef.current) {
                const rect = appRef.current.getBoundingClientRect()

                setRefDimensions({
                    x: rect.x,
                    y: rect.y,
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

                // Flip the action menu by multiplying -1

                const x =
                    centerX +
                    radius *
                        Math.cos(angle) *
                        (refDimensions.x > window.innerWidth / 2 ? -1 : 1)
                const y =
                    centerY +
                    radius *
                        Math.sin(angle) *
                        (refDimensions.y < window.innerHeight / 2 ? -1 : 1)

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

    const motionVariants: Variants = {
        hidden: { visibility: "hidden", opacity: 0 },
        visible: {
            visibility: "visible",
            opacity: 1,
            transition: {
                duration: duration.long4,
                ease: easing.decelerated,
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <motion.div
            ref={appRef}
            className={styles["app-container"]}
            style={{
                zIndex: isActive ? 100 : 0,
            }}
            whileTap={{
                scale: 1.2,
                zIndex: 100,
            }}
        >
            <Button
                type="application"
                id={`app_${id}`}
                label={name}
                icon={{ name: icon }}
                size="large"
                role="primary"
                onTapStart={() => handleOnTapStart(id)}
                onTap={() => handleCancelTap()}
                onTapCancel={() => handleCancelTap()}
            />

            <motion.div
                variants={motionVariants}
                initial="hidden"
                animate={showActions ? "visible" : "hidden"}
            >
                {actions.map((action, index) => (
                    <AppAction
                        key={`${id}-action-${index}`}
                        label={action.label}
                        icon={action.icon}
                        img={action.img}
                        position={actionPositions[index] || { x: 0, y: 0 }}
                    />
                ))}
            </motion.div>
        </motion.div>
    )
}

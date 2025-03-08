import { Button } from "./Button.tsx"
import { SymbolCodepoints } from "react-material-symbols"
import { FC, useEffect, useRef, useState } from "react"
import { motion, Variants } from "motion/react"
import useAppStore from "../store/appStore.ts"
import styles from "./Application.module.css"
import { duration, easing } from "../libs/motionUtils.ts"
import { toTitleCase } from "../libs/utils.ts"

export interface Application {
    id: string
    name: string
    icon: SymbolCodepoints
    actions: AppAction[]
}

export interface AppAction {
    id: string
    label: string
    icon?: SymbolCodepoints
    img?: string
}

const AppAction: FC<
    AppAction & {
        position: { x: number; y: number }
        isSelected: boolean
    }
> = ({ label, icon, img, position, isSelected }) => {
    const motionVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: isSelected ? 1.2 : 1,
            zIndex: isSelected ? 50 : 0,
            translateX: isSelected ? "-40%" : "-50%",
            translateY: isSelected ? "-100%" : "-50%",
        },
    }

    const actionLabel = toTitleCase(label)

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
        >
            <motion.div
                className={styles["action-label"]}
                initial={{ visibility: "hidden", opacity: 0 }}
                animate={{
                    visibility: "visible",
                    opacity: isSelected ? 1 : 0,
                }}
            >
                {actionLabel}
            </motion.div>
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
                    role={isSelected ? "primary" : "secondary"}
                />
            )}
        </motion.div>
    )
}

export const Application: FC<Application> = ({ id, name, icon, actions }) => {
    // Global States
    const selectApp = useAppStore((state) => state.selectApp)
    const selectAction = useAppStore((state) => state.selectAction)
    const clearSelection = useAppStore((state) => state.clearSelection)
    const activeAppId = useAppStore((state) => state.activeAppId)
    // Refs
    const appRef = useRef<HTMLDivElement>(null)
    const actionContainerRef = useRef<HTMLDivElement>(null)
    const longPressTimeRef = useRef<number | null>(null)
    const isPressingRef = useRef<boolean>(false)
    // Local States
    const [showActions, setShowActions] = useState<boolean>(false)
    const [actionPositions, setActionPositions] = useState<
        Array<{ x: number; y: number }>
    >([])
    const [selectedActionIndex, setSelectedActionIndex] = useState<
        number | null
    >(null)
    // Listen to ref element's dimensions for accurate positions of App Actions
    const [refDimensions, setRefDimensions] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    // Radius - distance between the app and its actions in pixels
    const RADIUS = 96

    // Scope control - how much of the circle to use for actions
    // Changed default to use a half circle at the bottom (π to 2π)
    const SCOPE_RADIANS = Math.PI / 1.5

    // Start angle offset (θ) - where the first item should be positioned
    const START_ANGLE = -45

    // Long-press timeout
    const LONG_PRESS_TIMEOUT = 500

    const isActive = id === activeAppId

    // Update the dimensions of the app
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

    // Calculate relative positions of actions in a ring around the central button
    useEffect(() => {
        if (showActions && appRef.current && actions.length > 0) {
            const positions = actions.map((_, index) => {
                // Use half dimensions for the center point
                const centerX = refDimensions.width / 2
                const centerY = refDimensions.height / 2

                const angleRadians = (START_ANGLE * Math.PI) / 2

                // Calculate the angle for this item (in radians)
                const angle =
                    angleRadians +
                    (index * SCOPE_RADIANS) /
                        (actions.length > 1 ? actions.length - 1 : 1)

                // Flip the action menu by multiplying -1

                const x =
                    centerX +
                    RADIUS *
                        Math.cos(angle) *
                        (refDimensions.x > window.innerWidth / 2 ? -1 : 1)
                const y =
                    centerY +
                    RADIUS *
                        Math.sin(angle) *
                        (refDimensions.y < window.innerHeight / 2 ? -1 : 1)

                return { x, y }
            })

            setActionPositions(positions)
        }
    }, [
        showActions,
        actions,
        SCOPE_RADIANS,
        START_ANGLE,
        refDimensions,
        RADIUS,
    ])

    // Find the closest action to the pointer
    function findClosestAction(
        pointerX: number,
        pointerY: number
    ): number | null {
        if (!actionContainerRef.current || actionPositions.length === 0)
            return null

        const actionContainerRect =
            actionContainerRef.current.getBoundingClientRect()
        const containerX = actionContainerRect.x
        const containerY = actionContainerRect.y

        let closestActionIndex = null
        let closestDistance = Infinity

        actionPositions.forEach((position, index) => {
            // Calculate absolute position of this action in the document
            const actionX = containerX + position.x - 56
            const actionY = containerY + position.y - 48

            // // Log the calculated positions for debugging
            // console.log(`Action ${index} at (${actionX}, ${actionY})`)

            const distance = Math.sqrt(
                Math.pow(pointerX - actionX, 2) +
                    Math.pow(pointerY - actionY, 2)
            )

            if (distance < closestDistance) {
                closestDistance = distance
                closestActionIndex = index
            }
        })

        // Use a reasonable radius for button hitbox - button size + small margin
        const BUTTON_DETECTION_RADIUS = 24

        // Only return as closest if truly near the button
        return closestDistance < BUTTON_DETECTION_RADIUS * 2
            ? closestActionIndex
            : null
    }

    function handleOnTapStart(appId: Application["id"]) {
        isPressingRef.current = true

        // Start the long-press timer
        longPressTimeRef.current = window.setTimeout(() => {
            setShowActions(true)
        }, LONG_PRESS_TIMEOUT)

        selectApp(appId)
    }

    function handlePointerMove(e: React.PointerEvent) {
        if (!showActions || !isPressingRef.current) return

        // Prevent default to avoid other behaviors
        e.preventDefault()

        // Find which action the pointer is closet to
        const pointerX = e.clientX
        const pointerY = e.clientY
        const closestAction = findClosestAction(pointerX, pointerY)

        // Update selected action
        setSelectedActionIndex(closestAction)
    }

    // function handleActionSelect(index: number) {
    //     setSelectedActionIndex(index)
    // }

    function handlePointerUp() {
        if (showActions && selectedActionIndex !== null) {
            selectAction(actions[selectedActionIndex])
        }

        cleanupPress()
    }

    function handleCancelTap() {
        cleanupPress()
    }

    function cleanupPress() {
        if (longPressTimeRef.current) {
            clearTimeout(longPressTimeRef.current)
            longPressTimeRef.current = null
        }

        // Reset all state
        isPressingRef.current = false
        clearSelection()
        setShowActions(false)
        setSelectedActionIndex(null)
    }

    const motionVariants: Variants = {
        hidden: {
            visibility: "hidden",
            opacity: 0,
        },
        visible: {
            visibility: "visible",
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <>
            <motion.div
                ref={appRef}
                className={styles["app-container"]}
                style={{
                    zIndex: isActive ? 100 : 0,
                }}
                whileTap={{
                    zIndex: 100,
                    transition: {
                        duration: duration.medium4,
                        easing: easing.decelerated,
                    },
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
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
                    ref={actionContainerRef}
                >
                    {actions.map((action, index) => (
                        <AppAction
                            key={index}
                            id={`${id}-action-${index}`}
                            label={action.label}
                            icon={action.icon}
                            img={action.img}
                            position={actionPositions[index] || { x: 0, y: 0 }}
                            isSelected={selectedActionIndex === index}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </>
    )
}

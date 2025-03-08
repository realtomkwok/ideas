import { MaterialSymbolWeight, SymbolCodepoints } from "react-material-symbols"
import { motion } from "motion/react"

interface BtnProps {
    type: "application" | "action"
    id: string
    label: string
    icon: {
        name: SymbolCodepoints
        fill?: boolean
        weight?: MaterialSymbolWeight
        grade?: -25 | 0 | 200
        opticalSize?: 20 | 24 | 40 | 48
    }
    onClick?: (e: React.MouseEvent) => void
    size: "small" | "large"
    role: "primary" | "secondary"
    onTapStart?: () => void
    onTap?: () => void
    onTapCancel?: () => void
}

export const Button: React.FC<BtnProps> = ({
    label,
    icon: { fill = true, grade = 0, opticalSize = 24, weight = 500, name },
    size,
    role = "primary",
    onTapStart,
    onTap,
    onTapCancel,
}) => {
    const radius: number = size === "large" ? 4 : 3

    return (
        <motion.button
            className={`btn-wrapper ${role}-container`}
            style={{ height: `${radius}rem`, width: `${radius}rem` }}
            aria-label={label}
            onTapStart={onTapStart}
            onTap={onTap}
            onTapCancel={onTapCancel}
            whileTap={{
                scale: 1.2,
                zIndex: 100,
            }}
        >
            <div className="state-layer" />
            <span
                className="material-symbols-rounded app-icon"
                style={{
                    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
                }}
            >
                {name}
            </span>
            <span className="visually-hidden">{label}</span>
        </motion.button>
    )
}

import { MaterialSymbolWeight, SymbolCodepoints } from "react-material-symbols"

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
    onTap?: () => void
    onClick?: (e: React.MouseEvent) => void
    size: "small" | "large"
}

export const Button: React.FC<BtnProps> = ({
    label,
    icon: { fill = true, grade = 0, opticalSize = 24, weight = 500, ...rest },
    size,
}) => {
    const radius: number = size === "large" ? 4 : 3

    return (
        <button
            className="btn-wrapper"
            style={{ height: `${radius}rem`, width: `${radius}rem` }}
            aria-label={label}
        >
            <div className="state-layer" />
            <span
                className="material-symbols-rounded app-icon"
                style={{
                    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
                }}
            >
                {rest.name}
            </span>
            <span className="visually-hidden">{label}</span>
        </button>
    )
}

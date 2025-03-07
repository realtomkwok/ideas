import { Application } from "./components/Application.tsx"

export const apps: Application[] = [
    {
        id: "phone",
        name: "Phone",
        icon: "phone",
        actions: [
            {
                id: "keypad",
                label: "keypad",
                icon: "dialpad",
            },
            {
                id: "recent",
                label: "recent",
                icon: "schedule",
            },
            {
                id: "contacts",
                label: "contacts",
                icon: "contacts",
            },
            {
                id: "favorites",
                label: "favorites",
                icon: "favorite",
            },
        ],
    },
    {
        id: "calendar",
        name: "Calendar",
        icon: "calendar_month",
        actions: [
            {
                id: "today",
                label: "today",
                icon: "today",
            },
            {
                id: "week",
                label: "week",
                icon: "calendar_view_week",
            },
            {
                id: "month",
                label: "month",
                icon: "calendar_month",
            },
        ],
    },
    {
        id: "camera",
        name: "Camera",
        icon: "photo_camera",
        actions: [
            {
                id: "portrait",
                label: "portrait",
                icon: "portrait",
            },
            {
                id: "slo-mo",
                label: "slo-mo",
                icon: "slow_motion_video",
            },
            {
                id: "video",
                label: "video",
                icon: "video_camera_back",
            },
            {
                id: "timer",
                label: "timer",
                icon: "timer",
            },
        ],
    },
    {
        id: "map",
        name: "Maps",
        icon: "map",
        actions: [
            {
                id: "search",
                label: "search",
                icon: "search",
            },
            {
                id: "directions",
                label: "directions",
                icon: "directions",
            },
            {
                id: "home",
                label: "home",
                icon: "home",
            },
            {
                id: "work",
                label: "work",
                icon: "work",
            },
        ],
    },
]

import { Application } from "./components/Application.tsx"

export const apps: Application[] = [
    {
        id: "phone",
        name: "Phone",
        icon: "phone",
        actions: [
            {
                label: "keypad",
                icon: "dialpad",
            },
            {
                label: "recent",
                icon: "schedule",
            },
            {
                label: "contacts",
                icon: "contacts",
            },
            {
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
                label: "today",
                icon: "today",
            },
            {
                label: "week",
                icon: "calendar_view_week",
            },
            {
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
                label: "portrait",
                icon: "portrait",
            },
            {
                label: "slo-mo",
                icon: "slow_motion_video",
            },
            {
                label: "video",
                icon: "video_camera_back",
            },
            {
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
                label: "search",
                icon: "search",
            },
            {
                label: "directions",
                icon: "directions",
            },
            {
                label: "home",
                icon: "home",
            },
            {
                label: "work",
                icon: "work",
            },
        ],
    },
]

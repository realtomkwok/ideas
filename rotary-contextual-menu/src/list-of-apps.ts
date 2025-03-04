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
    // {
    //     id: "email",
    //     name: "Email",
    //     icon: "email",
    //     actions: [
    //         {
    //             label: "draft",
    //             icon: "draft",
    //         },
    //     ],
    // },
]

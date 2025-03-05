export const easing = {
    // Standard easing
    emphasized: [0, 0.2, 1, 1],
    decelerated: [0.05, 0.7, 0.1, 1],
    accelerated: [0.3, 0, 0.8, 0.15],
}

// Duration presets (in seconds)
export const duration = {
    short1: 0.05 /* 50ms */,
    short2: 0.1 /* 100ms */,
    short3: 0.15 /* 150ms */,
    short4: 0.2 /* 200ms */,
    medium1: 0.25 /* 250ms */,
    medium2: 0.3 /* 300ms */,
    medium3: 0.35 /* 350ms */,
    medium4: 0.4 /* 400ms */,
    long1: 0.45 /* 450ms */,
    long2: 0.5 /* 500ms */,
    long3: 0.55 /* 550ms */,
    long4: 0.6 /* 600ms */,
    xlong1: 0.7 /* 700ms */,
    xlong2: 0.8 /* 800ms */,
    xlong3: 0.9 /* 900ms */,
    xlong4: 1,
}

// Common transition presets
export const transition = {
    onScreen: {
        duration: duration.long2,
        ease: easing.emphasized,
    },
    enter: {
        duration: duration.medium4,
        ease: easing.decelerated,
    },
    exit: {
        duration: duration.short4,
        ease: easing.accelerated,
    },
}

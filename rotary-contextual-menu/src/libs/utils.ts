export function toTitleCase(text: string) {
    const res = text.split(" ").map((word) => {
        return word.charAt(0).toLocaleUpperCase() + word.slice(1)
    })
    return res.join(" ")
}

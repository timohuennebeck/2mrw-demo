export const toTitleCase = (text: string): string => {
    if (!text) return text;

    return text
        .toLowerCase()
        .split(" ")
        .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(" ");
};

export const handleError = (error: unknown, fnTitle: string) => {
    console.error(`Error in: ${fnTitle}`, error);

    return { error };
};

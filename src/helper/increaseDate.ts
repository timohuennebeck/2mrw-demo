export const increaseDate = ({ date, days }: { date: Date; days: number }) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
};

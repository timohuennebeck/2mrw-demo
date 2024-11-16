import moment, { Moment } from "moment";

export const formatDateToDayMonthYear = (dateString: string) => {
    const date = moment(dateString);
    return date.format("D MMMM YYYY");
};

export const increaseDate = ({ date, days }: { date: Moment; days: number }) => {
    let result = moment(date);

    result.add(days, "days");

    return result;
};

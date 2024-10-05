import moment, { Moment } from "moment";

export const increaseDate = ({ date, days }: { date: Moment; days: number }) => {
    let result = moment(date);

    result.add(days, "days");

    return result;
};

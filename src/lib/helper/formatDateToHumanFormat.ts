import moment from "moment";

export const formatDateToHumanFormat = (dateString: string) => {
    const date = moment(dateString);

    const day = date.date().toString().padStart(2, "0");
    const month = (date.month() + 1).toString().padStart(2, "0");
    const year = date.year();

    return `${day}-${month}-${year}`;
};

import moment from "moment";

export const formatDateToHumanFormat = (dateString: string) => {
    const date = moment(dateString);
    return date.format("D MMMM YYYY");
};

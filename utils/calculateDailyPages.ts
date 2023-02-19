import dayjs from "https://esm.sh/dayjs"
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export const calculateDailyPages = (khatamDate: string, startingPage: number, pagesRead = 0) => {
    const pagesLeft = calculatePagesLeft(startingPage, pagesRead)
    // TODO: get khatamDate from DB
    const daysLeft = dayjs(khatamDate, "D/M/YYYY").diff(dayjs(), "day")

    return (pagesLeft / daysLeft).toFixed(1)
}

const calculatePagesLeft = (startingPage: number, pagesRead = 0) => {
    return 604 - startingPage - pagesRead
}


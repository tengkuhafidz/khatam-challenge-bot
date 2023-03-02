import dayjs from "https://esm.sh/dayjs";
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat";
import { parseKhatamDate } from "./date.ts";

dayjs.extend(customParseFormat)

export const calculateDailyPages = (khatamDate: string, pagesRead: number, khatamPages: number) => {
    console.log("Calculating daily pages left...", khatamDate, pagesRead, khatamPages)
    const pagesLeft = calculatePagesLeft(pagesRead, khatamPages)
    const daysLeft = calculateDaysLeft(khatamDate)
    const formattedPagesLeft = Math.ceil(pagesLeft / daysLeft)
    return formattedPagesLeft
}

const calculatePagesLeft = (pagesRead: number, khatamPages: number) => {
    const khatamCount = calculateKhatamCount(pagesRead, khatamPages)
    return ((khatamCount + 1) * khatamPages) - pagesRead
}

export const calculateKhatamCount = (pagesRead: number, khatamPages: number) => {
    return Math.floor(pagesRead / khatamPages)
}

export const calculateDaysLeft = (khatamDate: string) => {
    return parseKhatamDate(khatamDate).diff(dayjs(), "day")
}

export const calculatePercentageRead = (pagesRead: number, khatamPages: number) => {
    return ((pagesRead / khatamPages) * 100).toFixed(0) + "%"
}
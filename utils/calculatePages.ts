import dayjs from "https://esm.sh/dayjs";
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat";
import { parseKhatamDate } from "./date.ts";

dayjs.extend(customParseFormat)

export const calculateDailyPages = (khatamDate: string, pagesRead: number, khatamPages: number) => {
    console.log("Calculating daily pages left...", khatamDate, pagesRead, khatamPages)
    const correctedPagesRead = pagesRead < 0 ? 0 : pagesRead
    const pagesLeft = calculatePagesLeft(correctedPagesRead, khatamPages)
    const daysLeft = calculateDaysLeft(khatamDate)
    const daysLeftForCalculation = daysLeft > 0 ? daysLeft : 1
    const formattedPagesLeft = Math.ceil(pagesLeft / daysLeftForCalculation)
    return formattedPagesLeft
}

const calculatePagesLeft = (pagesRead: number, khatamPages: number) => {
    const khatamCount = calculateKhatamCount(pagesRead, khatamPages)
    return ((khatamCount + 1) * khatamPages) - pagesRead
}

export const calculateKhatamCount = (pagesRead: number, khatamPages: number) => {
    const correctedPagesRead = pagesRead < 0 ? 0 : pagesRead
    return Math.floor(correctedPagesRead / khatamPages)
}

export const calculateDaysLeft = (khatamDate: string) => {
    return parseKhatamDate(khatamDate).diff(dayjs(), "day") + 1
}

export const calculatePercentageRead = (pagesRead: number, khatamPages: number) => {
    const correctedPagesRead = pagesRead < 0 ? 0 : pagesRead
    return ((correctedPagesRead / khatamPages) * 100).toFixed(0) + "%"
}
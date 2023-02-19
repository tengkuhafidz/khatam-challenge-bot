import dayjs from "https://esm.sh/dayjs"
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat"
import { TOTAL_QURAN_PAGES } from "../constants/quran.ts";

dayjs.extend(customParseFormat)

export const calculateDailyPages = (khatamDate: string, pagesRead = 0) => {
    console.log("Calculating daily pages left...", khatamDate, pagesRead)
    const pagesLeft = calculatePagesLeft(pagesRead)
    const daysLeft = dayjs(khatamDate, "D/M/YYYY").diff(dayjs(), "day")

    return (pagesLeft / daysLeft).toFixed(1)
}

const calculatePagesLeft = (pagesRead = 0) => {
    return TOTAL_QURAN_PAGES - pagesRead
}

export const calculateDaysLeft = (khatamDate: string) => {
    return dayjs(khatamDate, "D/M/YYYY").diff(dayjs(), "day")
}

export const calculatePercentageRead = (pagesRead: number) => {
    return pagesRead === 0 ? "0%" : ((pagesRead / TOTAL_QURAN_PAGES) * 100).toFixed(0) + "%"
}
import dayjs from "https://esm.sh/dayjs";
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat";
import { TOTAL_QURAN_PAGES } from "../constants/quran.ts";
import { parseKhatamDate } from "./date.ts";

dayjs.extend(customParseFormat)

export const calculateDailyPages = (khatamDate: string, pagesRead = 0) => {
    console.log("Calculating daily pages left...", khatamDate, pagesRead)
    const pagesLeft = calculatePagesLeft(pagesRead)
    const daysLeft = parseKhatamDate(khatamDate).diff(dayjs(), "day")
    const formattedPagesLeft = pagesLeft < 0 ? 0 : Math.ceil(pagesLeft / daysLeft)
    return formattedPagesLeft
}

const calculatePagesLeft = (pagesRead = 0) => {
    return TOTAL_QURAN_PAGES - pagesRead
}

export const calculateDaysLeft = (khatamDate: string) => {
    return parseKhatamDate(khatamDate).diff(dayjs(), "day")
}

export const calculatePercentageRead = (pagesRead: number) => {
    if (pagesRead >= TOTAL_QURAN_PAGES) {
        return "100%"
    }

    if (pagesRead === 0) {
        return "0%"
    }

    return ((pagesRead / TOTAL_QURAN_PAGES) * 100).toFixed(0) + "%"
}
import dayjs from "https://esm.sh/dayjs";
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat";
import utc from "https://esm.sh/dayjs/plugin/utc";
import timezone from "https://esm.sh/dayjs/plugin/timezone";

import { parseKhatamDate } from "./date.ts";

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
const localTimezone = 'Asia/Singapore'
const dayjsLocal = dayjs().tz(localTimezone)

export const calculateDailyPages = (khatamDate: string, pagesRead: number, khatamPages: number) => {
    console.log("Calculating daily pages left...", khatamDate, pagesRead, khatamPages)
    const correctedPagesRead = pagesRead < 0 ? 0 : pagesRead
    const pagesLeft = calculatePagesLeft(correctedPagesRead, khatamPages)
    const daysLeft = calculateDaysLeft(khatamDate) + 1
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
    console.log("curr day", dayjs().format())
    console.log("with utcOffset", dayjs().utcOffset(8).format())
    console.log("with utcOffset start of day", dayjs().utcOffset(8).startOf('day').format())
    console.log("local timezone", dayjsLocal.format())

    return parseKhatamDate(khatamDate).diff(dayjs().utcOffset(8).startOf('day'), "day")
}

export const calculatePercentageRead = (pagesRead: number, khatamPages: number) => {
    const correctedPagesRead = pagesRead < 0 ? 0 : pagesRead
    return ((correctedPagesRead / khatamPages) * 100).toFixed(0) + "%"
}
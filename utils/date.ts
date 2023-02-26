import dayjs from "https://esm.sh/dayjs"
import customParseFormat from "https://esm.sh/dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

const KHATAM_DATE_FORMAT = "D/M/YYYY"

export const parseKhatamDate = (khatamDate: string) => {
    return dayjs(khatamDate, KHATAM_DATE_FORMAT)
}
import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js";
import { BotCommands } from "../constants/botCommands.ts";
import { ParticipantDetails, Participants } from "../types/index.ts";
import { calculateDailyPages, calculateDaysLeft, calculateKhatamCount, calculatePercentageRead } from "./calculatePages.ts";
import { parseKhatamDate } from "./date.ts";
import { delay } from "./delay.ts";

// =============================================================================
// Display Khatam Goal
// =============================================================================

export const displayNewKhatamGoal = async (ctx: Context, khatamDate: string, khatamPages: number) => {
    const text = `🎯 <b>New Khatam Goal</b>
${constructKhatamGoalText(khatamDate, khatamPages)}

🤖 Use /${BotCommands.EditKhatamPages} or /${BotCommands.EditKhatamDate} to edit your khatam goals.
`

    await ctx.reply(text, {
        parse_mode: "HTML"
    });
}

export const constructKhatamGoalText = (khatamDate: string, khatamPages: number) => {
    console.log(">>> khatamDate", khatamDate)
    const daysLeft = calculateDaysLeft(khatamDate)
    console.log(">>> daysLeft", daysLeft)

    return `To read ${khatamPages} pages by ${parseKhatamDate(khatamDate).format('DD MMMM YYYY')} <i>(${constructDaysLeftText(daysLeft)})</i>`
}

const constructDaysLeftText = (daysLeft: number) => {
    if (daysLeft > 1) {
        return `${daysLeft} days left`
    }

    if (daysLeft === 1) {
        return `1 day to go! 💪🏽`
    }

    if (daysLeft === 0) {
        return `Today! 😎`
    }

    if (daysLeft < 0) {
        return `Overdue 😅`
    }
}

// =============================================================================
// Display Participants List
// =============================================================================

export const displayParticipantsList = async (ctx: Context, khatamDate: string, participants: Participants, khatamPages: number) => {
    await delay(2500)

    const text = `🎯 <b>Khatam Goal</b>
${constructKhatamGoalText(khatamDate, khatamPages)}
${constructParticipantsList(participants, khatamDate, khatamPages)}
🤖 Use /${BotCommands.Read} to add the number of pages you have read.
`
    await ctx.reply(text, {
        parse_mode: "HTML"
    });
}

const constructParticipantsList = (participants: Participants, khatamDate: string, khatamPages: number) => {
    const sortedParticipants = _.orderBy(Object.values(participants), ['pagesRead', 'lastReadAt'], ['desc', 'asc']) as ParticipantDetails[];
    return `${sortedParticipants.map((participantDetails) => {
        return formatParticipantDetails(participantDetails, khatamDate, khatamPages)
    }).join('')}
`
}

const formatParticipantDetails = (participantDetails: ParticipantDetails, khatamDate: string, khatamPages: number) => {
    const { name, pagesRead } = participantDetails;
    const numberOfKhatam = calculateKhatamCount(pagesRead, khatamPages)
    const khatamStars = "⭐️".repeat(numberOfKhatam)
    const toKhatamAgainPhrase = numberOfKhatam > 0 ? "to complete again" : ""

    return `
<b>${name} ${khatamStars}</b>
✅ Have read ${pagesRead} pages (${calculatePercentageRead(pagesRead, khatamPages)})
📈 To read ${calculateDailyPages(khatamDate, pagesRead, khatamPages)} pages per day ${toKhatamAgainPhrase}
`
}
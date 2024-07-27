import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js";
import { BotCommands, commandDescriptions } from "../constants/botCommands.ts";
import { ParticipantDetails, Participants } from "../types/index.ts";
import { calculateDailyPages, calculateDaysLeft, calculateKhatamCount, calculatePercentageRead } from "./calculatePages.ts";
import { parseKhatamDate } from "./date.ts";
import { delay } from "./delay.ts";
import { getKhatamPlannerUrl } from "./getKhatamPlannerUrl.ts";

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
    const daysLeft = calculateDaysLeft(khatamDate)

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

    if (daysLeft < 1) {
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
🤖 Use /${BotCommands.Read2} to ${commandDescriptions[BotCommands.Read2].toLowerCase()}.
🤖 Use /${BotCommands.UpdateTotal} to ${commandDescriptions[BotCommands.UpdateTotal].toLowerCase()}.
`
    await ctx.reply(text, {
        parse_mode: "HTML",
        disable_web_page_preview: true
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
    const daysLeft = calculateDaysLeft(khatamDate)
    const khatamStars = "⭐️".repeat(numberOfKhatam)
    const toKhatamAgainPhrase = numberOfKhatam > 0 ? "to complete again" : ""
    const currentPage = pagesRead - (numberOfKhatam * khatamPages)

    return `
<b>${name} ${khatamStars}</b>
✅ Current page: ${pagesRead} (${calculatePercentageRead(currentPage, khatamPages)})
📈 To read <a href="${getKhatamPlannerUrl(daysLeft, currentPage)}">${calculateDailyPages(khatamDate, currentPage, khatamPages)} pages per day</a> ${toKhatamAgainPhrase}
`
}
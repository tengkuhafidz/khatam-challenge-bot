import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";
import { ParticipantDetails, Participants } from "../types/index.ts";
import { calculateDailyPages, calculateDaysLeft, calculateKhatamCount, calculatePercentageRead } from "../utils/calculatePages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { parseKhatamDate } from "../utils/date.ts";
import { hasJoinedChallenge, hasJoinedErrorResponse, hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";

export const joinChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName, userId, chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!);
    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return
    }

    if (hasJoinedChallenge(groupDetails, userId!)) {
        await hasJoinedErrorResponse(ctx)
        return
    }

    await DbQueries.saveParticipantDetails(chatId!, userName, userId!, 0)
    await ctx.reply(`Welcome to the khatam challenge, <b>${userName}</b> 👋🏽

Here are the list of current participants 👇🏽`, {
        parse_mode: "HTML",
    });

    // TODO: consider optimising such that we dont have to do another db call here
    const { khatamDate, participants, khatamPages } = await DbQueries.getGroupDetails(chatId!);
    await displayParticipantsList(ctx, khatamDate, participants, khatamPages)
}

export const displayParticipantsList = async (ctx: Context, khatamDate: string, participants: Participants, khatamPages: number) => {
    const daysLeft = calculateDaysLeft(khatamDate)

    const text = `🗓 <b>Khatam: ${parseKhatamDate(khatamDate).format("DD MMMM YYYY")}</b>
${constructDaysLeftText(daysLeft)}
${constructParticipantsList(participants, khatamDate, khatamPages)}
🤖 Use /${BotCommands.Read} to log your progress
`

    await ctx.reply(text, {
        parse_mode: "HTML"
    });
}

const constructDaysLeftText = (daysLeft: number) => {
    if (daysLeft > 10) {
        return `${daysLeft} days left`
    }

    if (daysLeft > 1) {
        return `${daysLeft} days left 😎`
    }

    if (daysLeft === 1) {
        return `Tomorrow's the final day 💪🏽`
    }

    if (daysLeft === 0) {
        return `Khatam Day - May Allah bless your efforts 🥳`
    }

    if (daysLeft === -1) {
        return `${daysLeft * -1} day after 🙂`
    }

    if (daysLeft < -1) {
        return `${daysLeft * -1} days after 👀`
    }
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
📖 Have read <b>${pagesRead}</b>/${khatamPages} pages (${calculatePercentageRead(pagesRead, khatamPages)})
🎯 To read <b>${calculateDailyPages(khatamDate, pagesRead, khatamPages)}</b> pages per day ${toKhatamAgainPhrase}
`
}
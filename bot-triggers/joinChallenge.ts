import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.21-es/lodash.js";
import { BotCommands } from "../constants/botCommands.ts";
import { TOTAL_QURAN_PAGES } from "../constants/quran.ts";
import { DbQueries } from "../db-queries/index.ts";
import { ParticipantDetails, Participants } from "../types/index.ts";
import { calculateDailyPages, calculateDaysLeft, calculatePercentageRead } from "../utils/calculatePages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { parseKhatamDate } from "../utils/date.ts";
import { hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";

export const joinChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName, userId, chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!);

    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return
    }

    const startingPagePrompt = await ctx.reply(`Welcome to the khatam challenge, <b>${userName}</b> 👋🏽

Which page of the Quran will you be starting from?`, {
        reply_markup: { force_reply: true },
        parse_mode: "HTML",
    });

    return {
        userId: userId!,
        messageId: startingPagePrompt?.message_id
    }
}

// =============================================================================
// Catch-all Message Reply
// =============================================================================

export const saveParticipantDetails = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId, userName, userId } = ctxDetails
    const startingPageStr = messageText!
    if (!startingPageStr) {
        return
    }

    const startingPage = Number(startingPageStr)
    if (isNaN(startingPage) || startingPage < 1 || startingPage > 604) {
        const replyText = `🚫 <b>Invalid Starting Page Value</b>
Please ensure that your starting page value is a valid number within 1 - 604.

🤖 Use /${BotCommands.Join} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    const pagesRead = startingPage - 1
    await DbQueries.saveParticipantDetails(chatId!, userName, userId!, pagesRead)

    await ctx.reply(`Noted. Here are the list of current participants 👇🏽`, {
        parse_mode: "HTML"
    });

    const { khatamDate, participants } = await DbQueries.getGroupDetails(chatId!);
    await displayParticipantsList(ctx, khatamDate, participants)
}


export const displayParticipantsList = async (ctx: Context, khatamDate: string, participants: Participants) => {
    const daysLeft = calculateDaysLeft(khatamDate)

    const text = `🗓 <b>Khatam: ${parseKhatamDate(khatamDate).format("DD MMMM YYYY")}</b>
${constructDaysLeftText(daysLeft)}
${constructParticipantsList(participants, khatamDate)}
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

const constructParticipantsList = (participants: Participants, khatamDate: string) => {
    const sortedParticipants = _.orderBy(Object.values(participants), ['pagesRead', 'lastReadAt'], ['desc', 'asc']) as ParticipantDetails[];
    return `${sortedParticipants.map((participantDetails) => {
        return formatParticipantDetails(participantDetails, khatamDate)
    }).join('')}
`
}

const formatParticipantDetails = (participantDetails: ParticipantDetails, khatamDate: string) => {
    const { name, pagesRead } = participantDetails;

    const displayName = pagesRead >= TOTAL_QURAN_PAGES ? `⭐️${name}⭐️` : name
    const displayPagesRead = pagesRead > TOTAL_QURAN_PAGES ? TOTAL_QURAN_PAGES : pagesRead

    return `
<b>${displayName}</b>
📖 Have read ${displayPagesRead} / ${TOTAL_QURAN_PAGES} pages (${calculatePercentageRead(pagesRead)})
🎯 To read ${calculateDailyPages(khatamDate, pagesRead)} pages per day
`
}
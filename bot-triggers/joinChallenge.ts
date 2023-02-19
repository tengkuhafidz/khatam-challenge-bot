import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import dayjs from "https://esm.sh/dayjs";
import { BotCommands } from "../constants/botCommands.ts";
import { TOTAL_QURAN_PAGES } from "../constants/quran.ts";
import { DbQueries } from "../db-queries/index.ts";
import { ParticipantDetails } from "../types/index.ts";
import { Participants } from "../types/index.ts";
import { calculateDailyPages, calculateDaysLeft, calculatePercentageRead } from "../utils/calculatePages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";

export const joinChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName } = ctxDetails

    const startingPagePrompt = await ctx.reply(`Welcome to the khatam challenge, <b>${userName}</b> 👋🏽

Which page of the Quran will you be starting from?`, {
        reply_markup: { force_reply: true },
        parse_mode: "HTML"
    });

    return startingPagePrompt?.message_id
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
    await DbQueries.saveParticipantDetails(chatId!, userName, userId!, startingPage)
    const { khatamDate, participants } = await DbQueries.getGroupDetails(chatId!);
    const pagesDaily = calculateDailyPages(khatamDate, Number(startingPage))

    const replyText = `Cool! If you read <b>${pagesDaily} pages daily</b>, you should be able to complete it on time, insyaallah! 💪🏽`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });

    await displayParticipantsList(ctx, khatamDate, participants)
}

export const displayParticipantsList = async (ctx: Context, khatamDate: string, participants: Participants) => {
    const daysLeft = calculateDaysLeft(khatamDate)

    const text = `🗓 <b>Khatam: ${dayjs(khatamDate, "DD/MM/YYYY").format("DD MMMM YYYY")}</b>
${daysLeft} days left
${constructParticipantsList(participants, khatamDate)}
🤖 Use /${BotCommands.Read} to log your progress
`

    await ctx.reply(text, {
        parse_mode: "HTML"
    });
}


const constructParticipantsList = (participants: Participants, khatamDate: string) => {
    return `${Object.values(participants).map((participantDetails) => {
        return formatParticipantDetails(participantDetails, khatamDate)
    }).join('')}
`
}

const formatParticipantDetails = (participantDetails: ParticipantDetails, khatamDate: string) => {
    const { name, pagesRead } = participantDetails;
    return `
<b>${name}</b>
📖 Page ${pagesRead} / ${TOTAL_QURAN_PAGES} (${calculatePercentageRead(pagesRead)})
🎯 To read ${calculateDailyPages(khatamDate, pagesRead)} pages per day
`
}
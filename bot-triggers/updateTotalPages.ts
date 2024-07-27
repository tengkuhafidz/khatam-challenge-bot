import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { encouragements } from "../constants/encouragements.ts";
import { Gifs } from "../constants/gifs.ts";
import { DbQueries } from "../db-queries/index.ts";
import { Participants } from "../types/index.ts";
import { calculateDailyPages, calculateDaysLeft, calculateKhatamCount } from "../utils/calculatePages.ts";
import { displayParticipantsList } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { getKhatamPlannerUrl } from "../utils/getKhatamPlannerUrl.ts";
import { getRandom } from "../utils/getRandom.ts";
import { hasJoinedChallenge, hasStartedChallenge, noChallengeErrorResponse, notParticipantErrorResponse } from "../utils/vaildations.ts";

let groupDetails: any;


export const updateCurrentPage = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName, userId, chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!)

    if (!hasStartedChallenge(groupDetails!)) {
        await noChallengeErrorResponse(ctx)
        return null
    }

    if (!hasJoinedChallenge(groupDetails!, userId!)) {
        await notParticipantErrorResponse(ctx)
        return null
    }

    const pagesReadPrompt = await ctx.reply(`Which page did you complete reading, ${userName}?`, {
        reply_markup: { force_reply: true },
    });

    return {
        userId: userId!,
        messageId: pagesReadPrompt?.message_id
    }
}

// =============================================================================
// Catch-all Message Reply
// =============================================================================

export const saveTotalPagesRead = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId, userId } = ctxDetails
    const newCurrentPageStr = messageText!
    if (!newCurrentPageStr) {
        return
    }

    const newCurrentPage = Number(newCurrentPageStr)

    if (isNaN(newCurrentPage)) {
        const replyText = `🚫 <b>Invalid Pages Read Value</b>
Please ensure that your pages read value is a valid number.

🤖 Use /${BotCommands.Read} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    const initialTotalPagesRead = groupDetails?.participants[userId!]?.pagesRead!
    const newTotalPagesRead = getNewTotalPagesRead(initialTotalPagesRead, newCurrentPage, groupDetails.khatamPages)
    await DbQueries.saveTotalPagesRead(chatId!, userId!, newTotalPagesRead)

    const { participants: updatedParticipants } = await DbQueries.getGroupDetails(chatId!)

    await displayProgressMessages(ctx, groupDetails.khatamDate, newTotalPagesRead, updatedParticipants, groupDetails.khatamPages)
}

const getNewTotalPagesRead = (initialTotalPagesRead: number, newCurrentPage: number, khatamPages: number) => {
    const numberOfKhatam = calculateKhatamCount(initialTotalPagesRead, khatamPages)
    const initialCurrentPage = initialTotalPagesRead - (numberOfKhatam * khatamPages)
    return newCurrentPage >= initialCurrentPage ?
        (newCurrentPage - initialCurrentPage) + initialTotalPagesRead :
        (khatamPages - initialCurrentPage) + newCurrentPage + initialTotalPagesRead
}

export const displayProgressMessages = async (ctx: Context, khatamDate: string, totalPagesRead: number, participants: Participants, khatamPages: number) => {
    const hasNewKhatam = checkNewKhatam(initialTotalPagesRead, totalPagesRead, khatamPages)

    if (hasNewKhatam) {
        displayKhatamMessage(ctx)
    } else {
        displayEncouragingMessage(ctx, khatamDate, totalPagesRead, khatamPages)
    }

    await displayParticipantsList(ctx, khatamDate, participants, khatamPages)
}

const checkNewKhatam = (initialPagesRead: number, updatedPagesRead: number, khatamPages: number) => {
    const initialKhatamCount = calculateKhatamCount(initialPagesRead, khatamPages)
    const updatedKhatamCount = calculateKhatamCount(updatedPagesRead, khatamPages)
    return updatedKhatamCount > initialKhatamCount
}

export const displayEncouragingMessage = async (ctx: Context, khatamDate: string, totalPagesRead: number, khatamPages: number) => {
    const pagesDaily = calculateDailyPages(khatamDate, totalPagesRead, khatamPages)
    const daysLeft = calculateDaysLeft(khatamDate)

    const encouragingText = `${getRandom(encouragements)} 💚  

💡<b>TIP</b>: Plan to <a href="${getKhatamPlannerUrl(daysLeft, totalPagesRead)}">read ${pagesDaily} pages daily around your prayer times</a>.🧎🏽‍♂️`

    await ctx.reply(encouragingText, {
        parse_mode: "HTML",
        disable_web_page_preview: true
    });
}

export const displayKhatamMessage = async (ctx: Context) => {
    const khatamText = `Masyaallah, you have completed your Khatam goal! 🤩 Barakallahu feekum 🤲🏼`

    await ctx.reply(khatamText, {
        parse_mode: "HTML"
    });

    ctx.replyWithAnimation(getRandom(Gifs.khatam))
}
import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { encouragements } from "../constants/encouragements.ts";
import { Gifs } from "../constants/gifs.ts";
import { DbQueries } from "../db-queries/index.ts";
import { Participants } from "../types/index.ts";
import { calculateDailyPages, calculateKhatamCount } from "../utils/calculatePages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { delay } from "../utils/delay.ts";
import { getRandom } from "../utils/getRandom.ts";
import { hasJoinedChallenge, hasStartedChallenge, noChallengeErrorResponse, notParticipantErrorResponse } from "../utils/vaildations.ts";
import { displayParticipantsList } from "./joinChallenge.ts";

let initialPagesRead: number;

export const read = async (ctx: Context) => {
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

    initialPagesRead = groupDetails?.participants[userId!]?.pagesRead!

    const pagesReadPrompt = await ctx.reply(`How many pages did you read, ${userName}?`, {
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

export const savePagesReadIncrement = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId, userId } = ctxDetails
    const pagesReadStr = messageText!
    if (!pagesReadStr) {
        return
    }

    const inputPagesRead = Number(pagesReadStr)

    if (isNaN(inputPagesRead)) {
        const replyText = `🚫 <b>Invalid Pages Read Value</b>
Please ensure that your pages read value is a valid number.

🤖 Use /${BotCommands.Read} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    await DbQueries.savePagesReadIncrement(chatId!, userId!, inputPagesRead)
    const { khatamDate, participants, khatamPages } = await DbQueries.getGroupDetails(chatId!)
    const { pagesRead: totalPagesRead } = participants[userId!]
    await displayProgressMessages(ctx, khatamDate, totalPagesRead, participants, khatamPages)
}

export const displayProgressMessages = async (ctx: Context, khatamDate: string, totalPagesRead: number, participants: Participants, khatamPages: number) => {
    const hasNewKhatam = checkNewKhatam(initialPagesRead, totalPagesRead, khatamPages)

    if (hasNewKhatam) {
        displayKhatamMessage(ctx)
    } else {
        displayEncouragingMessage(ctx, khatamDate, totalPagesRead, khatamPages)
    }
    await delay(3000)
    await displayParticipantsList(ctx, khatamDate, participants, khatamPages)
}

const checkNewKhatam = (initialPagesRead: number, updatedPagesRead: number, khatamPages: number) => {
    const initialKhatamCount = calculateKhatamCount(initialPagesRead, khatamPages)
    const updatedKhatamCount = calculateKhatamCount(updatedPagesRead, khatamPages)
    return updatedKhatamCount > initialKhatamCount
}

export const displayEncouragingMessage = async (ctx: Context, khatamDate: string, totalPagesRead: number, khatamPages: number) => {
    const pagesDaily = calculateDailyPages(khatamDate, totalPagesRead, khatamPages)
    const hasKhatam = calculateKhatamCount(totalPagesRead, khatamPages) > 0

    const encouragingText = `${getRandom(encouragements)} 💚  

If you read <b>${pagesDaily} pages daily</b>, you should be able to complete your khatam goal ${hasKhatam ? "again" : "on time"}, insyaallah! 💪🏽`

    await ctx.reply(encouragingText, {
        parse_mode: "HTML"
    });
}

export const displayKhatamMessage = async (ctx: Context) => {
    const khatamText = `Masyaallah, you have completed your Khatam goal! 🤩 Barakallahu feekum 🤲🏼`

    await ctx.reply(khatamText, {
        parse_mode: "HTML"
    });

    ctx.replyWithAnimation(getRandom(Gifs.khatam))
}
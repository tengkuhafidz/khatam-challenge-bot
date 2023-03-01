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
    initialPagesRead = groupDetails?.participants[userId!]?.pagesRead!

    if (!hasStartedChallenge(groupDetails!)) {
        await noChallengeErrorResponse(ctx)
        return null
    }

    if (!hasJoinedChallenge(groupDetails!, userId!)) {
        await notParticipantErrorResponse(ctx)
        return null
    }

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
    const { khatamDate, participants } = await DbQueries.getGroupDetails(chatId!)
    const { pagesRead: totalPagesRead } = participants[userId!]
    await displayProgressMessages(ctx, khatamDate, totalPagesRead, participants)
}

const checkNewKhatam = (initialPagesRead: number, updatedPagesRead: number) => {
    const initialKhatamCount = calculateKhatamCount(initialPagesRead)
    const updatedKhatamCount = calculateKhatamCount(updatedPagesRead)
    return updatedKhatamCount > initialKhatamCount
}


export const displayProgressMessages = async (ctx: Context, khatamDate: string, totalPagesRead: number, participants: Participants) => {
    const hasNewKhatam = checkNewKhatam(initialPagesRead, totalPagesRead)

    if (hasNewKhatam) {
        displayKhatamMessage(ctx)
    } else {
        displayEncouragingMessage(ctx, khatamDate, totalPagesRead)
    }
    await delay(3000)
    await displayParticipantsList(ctx, khatamDate, participants)
}

export const displayEncouragingMessage = async (ctx: Context, khatamDate: string, totalPagesRead: number) => {
    const pagesDaily = calculateDailyPages(khatamDate, totalPagesRead)
    const hasKhatam = calculateKhatamCount(totalPagesRead) > 0

    const encouragingText = `${getRandom(encouragements)} 💚  

If you read <b>${pagesDaily} pages daily</b>, you should be able to khatam ${hasKhatam ? "again" : "on time"}, insyaallah! 💪🏽`

    await ctx.reply(encouragingText, {
        parse_mode: "HTML"
    });
}

export const displayKhatamMessage = async (ctx: Context) => {
    const khatamText = `Masyaallah, you have khatam the Quran! 🤩 Barakallahu feekum 🤲🏼`

    await ctx.reply(khatamText, {
        parse_mode: "HTML"
    });

    ctx.replyWithAnimation(getRandom(Gifs.khatam))
}
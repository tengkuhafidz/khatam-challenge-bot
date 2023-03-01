import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { encouragements } from "../constants/encouragements.ts";
import { Gifs } from "../constants/gifs.ts";
import { DbQueries } from "../db-queries/index.ts";
import { Participants } from "../types/index.ts";
import { calculateDailyPages } from "../utils/calculatePages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { delay } from "../utils/delay.ts";
import { getRandom } from "../utils/getRandom.ts";
import { hasJoinedChallenge, hasStartedChallenge, noChallengeErrorResponse, notParticipantErrorResponse } from "../utils/vaildations.ts";
import { displayParticipantsList } from "./joinChallenge.ts";

export const read = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName, userId, chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!)
    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return null
    }

    if (!hasJoinedChallenge(groupDetails, userId!)) {
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
    const { pagesRead: updatedPagesReadStr } = participants[userId!]
    const pagesDaily = calculateDailyPages(khatamDate, Number(updatedPagesReadStr))

    await displayProgressMessages(ctx, khatamDate, pagesDaily, participants)
}

export const displayProgressMessages = async (ctx: Context, khatamDate: string, pagesDaily: number, participants: Participants) => {

    if (pagesDaily > 0) {
        const encouragingText = `${getRandom(encouragements)} 💚  

If you read <b>${pagesDaily} pages daily</b>, you should be able to complete it on time, insyaallah! 💪🏽`

        await ctx.reply(encouragingText, {
            parse_mode: "HTML"
        });
    }

    if (pagesDaily <= 0) {
        const khatamText = `Masyaallah, you have khatam the Quran! 🤩 Barakallahu feekum 🤲🏼`

        await ctx.reply(khatamText, {
            parse_mode: "HTML"
        });

        ctx.replyWithAnimation(getRandom(Gifs.khatam))
    }

    await delay(3000)
    await displayParticipantsList(ctx, khatamDate, participants)
}
import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { DbQueries } from "../db-queries/index.ts";
import { calculateDailyPages } from "../utils/calculateDailyPages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";

export const read = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName } = ctxDetails

    const pagesReadPrompt = await ctx.reply(`How many pages did you read, ${userName}?`, {
        reply_markup: { force_reply: true },
    });

    return pagesReadPrompt?.message_id
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

    const pagesRead = Number(pagesReadStr)
    await DbQueries.savePagesReadIncrement(chatId!, userId!, pagesRead)
    const { khatamDate, participants } = await DbQueries.getGroupDetails(chatId!)
    const startingPage = Number(participants[userId!].startingPage as string)
    const pagesDaily = calculateDailyPages(khatamDate, startingPage, Number(pagesRead))

    const replyText = `Cool! If you read <b>${pagesDaily} pages daily</b>, you should be able to complete it on time, insyaallah! 💪🏽`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}
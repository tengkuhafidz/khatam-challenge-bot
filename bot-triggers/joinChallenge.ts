import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { DbQueries } from "../db-queries/index.ts";
import { calculateDailyPages } from "../utils/calculateDailyPages.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";

export const joinChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName } = ctxDetails

    const startingPagePrompt = await ctx.reply(`Ahlan, ${userName}. Welcome to the khatam challenge 👋🏽

Which page of the Quran will you be starting from?`, {
        reply_markup: { force_reply: true },
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
    const { khatamDate } = await DbQueries.getGroupDetails(chatId!);
    const pagesDaily = calculateDailyPages(khatamDate, Number(startingPage))

    const replyText = `Cool! If you read <b>${pagesDaily} pages daily</b>, you should be able to complete it on time, insyaallah! 💪🏽`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}
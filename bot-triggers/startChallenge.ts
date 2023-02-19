import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { DbQueries } from "../db-queries/index.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";

export const startChallenge = async (ctx: Context) => {
    const text = `What is the Khatam goal date? (format: DD/MM/YYYY)

<i>To complete by Ramadhan, set to: 22/04/2023</i>`

    const khatamDatePrompt = await ctx.reply(text, {
        reply_markup: { force_reply: true },
        parse_mode: "HTML"
    });

    return khatamDatePrompt?.message_id
}

// =============================================================================
// Catch-all Message Reply
// =============================================================================

export const saveKhatamDate = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId } = ctxDetails
    const khatamDate = messageText!

    if (!khatamDate) {
        return
    }

    await DbQueries.saveKhatamDate(chatId!, khatamDate)

    const replyText = `Khatam by <b>${khatamDate}</b> challenge initiated! 🤩

🤖 Use /join_khatam_challenge to join!`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}

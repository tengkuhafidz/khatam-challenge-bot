import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";

export const restartChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userId } = ctxDetails

    const text = `<b>♻️ Restarting Challenge...</b>
What is the new khatam goal date? (format: DD/MM/YYYY)

⚠️ <i>Users will need to rejoin the challenge. Ignore this prompt to cancel.</i>`

    const khatamDatePrompt = await ctx.reply(text, {
        reply_markup: { force_reply: true },
        parse_mode: "HTML"
    });

    return {
        userId: userId!,
        messageId: khatamDatePrompt?.message_id
    }
}
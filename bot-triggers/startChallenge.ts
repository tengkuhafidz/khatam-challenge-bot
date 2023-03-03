import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { TOTAL_QURAN_PAGES } from "../constants/quran.ts";
import { DbQueries } from "../db-queries/index.ts";
import { constructKhatamGoalText } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { parseKhatamDate } from "../utils/date.ts";

export const startChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userId } = ctxDetails

    const text = `What is the khatam goal date? (format: DD/MM/YYYY)

<i>To complete by Ramadhan, set to: 22/04/2023</i>`

    const khatamDatePrompt = await ctx.reply(text, {
        reply_markup: { force_reply: true },
        parse_mode: "HTML"
    });

    return {
        userId: userId!,
        messageId: khatamDatePrompt?.message_id
    }
}

// =============================================================================
// Catch-all Message Reply
// =============================================================================

export const saveKhatamChallengeDetails = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId } = ctxDetails
    const khatamDate = messageText!

    if (!khatamDate) {
        return
    }

    if (!parseKhatamDate(khatamDate).isValid()) {
        const replyText = `🚫 <b>Invalid Date Format</b>
Please ensure your date format is DD/MM/YYYY (e.g. 22/04/20203)

🤖 Use /${BotCommands.StartChallenge} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    await DbQueries.saveKhatamChallengeDetails(chatId!, khatamDate)

    const replyText = `🎯 <b>Khatam Challenge Started</b>
${constructKhatamGoalText(khatamDate, TOTAL_QURAN_PAGES)}

🤖 Use /${BotCommands.Join} to join.`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}

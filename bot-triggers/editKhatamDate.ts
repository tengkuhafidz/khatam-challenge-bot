import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";
import { GroupDetails } from "../types/index.ts";
import { displayNewKhatamGoal } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { parseKhatamDate } from "../utils/date.ts";
import { hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";

let groupDetails: GroupDetails

export const editKhatamDate = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userId, chatId } = ctxDetails

    groupDetails = await DbQueries.getGroupDetails(chatId!);
    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return null
    }
    const text = `What is the new khatam goal date? (format: DD/MM/YYYY)

<i>The current khatam goal date is: ${groupDetails.khatamDate}</i>`

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

export const saveKhatamDate = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId } = ctxDetails
    const newKhatamDate = messageText!

    if (!newKhatamDate) {
        return
    }

    if (!parseKhatamDate(newKhatamDate).isValid()) {
        const replyText = `🚫 <b>Invalid Date Format</b>
Please ensure your date format is DD/MM/YYYY (e.g. 22/04/20203)

🤖 Use /${BotCommands.EditKhatamDate} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    await DbQueries.saveKhatamDate(chatId!, newKhatamDate)

    await displayNewKhatamGoal(ctx, newKhatamDate, groupDetails.khatamPages)
}



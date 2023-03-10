import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";
import { GroupDetails } from "../types/index.ts";
import { displayNewKhatamGoal } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";

let groupDetails: GroupDetails

export const editKhatamPages = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userId, chatId } = ctxDetails

    groupDetails = await DbQueries.getGroupDetails(chatId!)

    if (!hasStartedChallenge(groupDetails!)) {
        await noChallengeErrorResponse(ctx)
        return null
    }

    const khatamPagesGoalPromptText = `How many pages does this group aim to complete?`

    const khatamPagesGoalPrompt = await ctx.reply(khatamPagesGoalPromptText, {
        reply_markup: { force_reply: true },
    });

    return {
        userId: userId!,
        messageId: khatamPagesGoalPrompt?.message_id
    }
}


// =============================================================================
// Catch-all Message Reply
// =============================================================================

export const saveKhatamPages = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { messageText, chatId } = ctxDetails
    const khatamPagesStr = messageText!
    if (!khatamPagesStr) {
        return
    }

    const newKhatamPages = Number(khatamPagesStr)

    if (isNaN(newKhatamPages) || newKhatamPages < 1) {
        const replyText = `🚫 <b>Invalid Khatam Pages Value</b>
Please ensure that your pages read value is a valid positive number.

🤖 Use /${BotCommands.EditKhatamPages} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    await DbQueries.saveKhatamPages(chatId!, newKhatamPages)

    await displayNewKhatamGoal(ctx, groupDetails.khatamDate, newKhatamPages)
}
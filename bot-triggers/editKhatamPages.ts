import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";
import { displayParticipantsList } from "./joinChallenge.ts";

export const editKhatamPages = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userId, chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!)

    if (!hasStartedChallenge(groupDetails!)) {
        await noChallengeErrorResponse(ctx)
        return null
    }

    const khatamPagesGoalPromptText = `How many pages does this group aim to complete by ${groupDetails.khatamDate}?`


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

    const inputKhatamPages = Number(khatamPagesStr)

    if (isNaN(inputKhatamPages) || inputKhatamPages < 1) {
        const replyText = `🚫 <b>Invalid Khatam Pages Value</b>
Please ensure that your pages read value is a valid number more than 0.

🤖 Use /${BotCommands.EditKhatamPages} to try again.`

        await ctx.reply(replyText, {
            parse_mode: "HTML"
        });
        // reply error message
        return
    }

    await DbQueries.saveKhatamPages(chatId!, inputKhatamPages)
    const { khatamDate, khatamPages, participants } = await DbQueries.getGroupDetails(chatId!)

    await displayParticipantsList(ctx, khatamDate, participants, khatamPages)
}
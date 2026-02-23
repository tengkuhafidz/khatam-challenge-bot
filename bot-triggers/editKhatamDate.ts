import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { DbQueries } from "../db-queries/index.ts";

import { calculateDaysLeft } from "../utils/calculatePages.ts";
import { displayNewKhatamGoal } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { parseKhatamDate } from "../utils/date.ts";
import { hasStartedChallenge, invalidKhatamDateErrorResponse, isInvalidKhatamDate, noChallengeErrorResponse } from "../utils/vaildations.ts";

export const editKhatamDate = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!);
    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return
    }
    const text = `What is the new khatam goal date? (format: DD/MM/YYYY)

<i>The current khatam goal date is: ${groupDetails.khatamDate}</i>`

    await ctx.reply(text, {
        reply_markup: { force_reply: true },
        parse_mode: "HTML"
    });
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

    if (isInvalidKhatamDate(newKhatamDate)) {
        await invalidKhatamDateErrorResponse(ctx)
        return
    }

    await DbQueries.saveKhatamDate(chatId!, newKhatamDate)

    const groupDetails = await DbQueries.getGroupDetails(chatId!)
    await displayNewKhatamGoal(ctx, newKhatamDate, groupDetails.khatamPages)
}



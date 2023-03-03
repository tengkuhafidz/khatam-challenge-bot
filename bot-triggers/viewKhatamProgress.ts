import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { DbQueries } from "../db-queries/index.ts";
import { displayParticipantsList } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { hasNoParticipants, hasParticipants, hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";

export const viewKhatamProgress = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!);
    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return
    }

    if (!hasParticipants(groupDetails)) {
        await hasNoParticipants(ctx)
        return
    }

    const { khatamDate, participants, khatamPages } = groupDetails
    await displayParticipantsList(ctx, khatamDate, participants, khatamPages)
}

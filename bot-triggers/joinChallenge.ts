import { Context } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { DbQueries } from "../db-queries/index.ts";
import { displayParticipantsList } from "../utils/commonReplies.ts";
import { CtxDetails } from "../utils/CtxDetails.ts";
import { hasJoinedChallenge, hasJoinedErrorResponse, hasStartedChallenge, noChallengeErrorResponse } from "../utils/vaildations.ts";

export const joinChallenge = async (ctx: Context) => {
    const ctxDetails = new CtxDetails(ctx)
    const { userName, userId, chatId } = ctxDetails

    const groupDetails = await DbQueries.getGroupDetails(chatId!);
    if (!hasStartedChallenge(groupDetails)) {
        await noChallengeErrorResponse(ctx)
        return
    }

    if (hasJoinedChallenge(groupDetails, userId!)) {
        await hasJoinedErrorResponse(ctx)
        return
    }

    await DbQueries.saveParticipantDetails(chatId!, userName, userId!, 0)
    await ctx.reply(`Welcome to the khatam challenge, <b>${userName}</b> 👋🏽

May Allah accept your good intentions and guide you towards achieving them. Ameen. 🤲🏼`, {
        parse_mode: "HTML",
    });

    // TODO: consider optimising such that we dont have to do another db call here
    const { khatamDate, participants, khatamPages } = await DbQueries.getGroupDetails(chatId!);
    await displayParticipantsList(ctx, khatamDate, participants, khatamPages)
}

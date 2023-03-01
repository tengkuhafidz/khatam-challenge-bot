import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { GroupDetails } from "../types/index.ts";

// =============================================================================
// Has Started Challenge
// =============================================================================

export const hasStartedChallenge = (groupDetails: GroupDetails) => {
    return !!groupDetails && !!groupDetails?.khatamDate
}

export const noChallengeErrorResponse = async (ctx: Context) => {
    const replyText = `🚫 <b>Khatam Challenge Not Started</b>
It looks like no khatam challenge was started in this group.
    
🤖 Use /${BotCommands.StartChallenge} to start.`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}

// =============================================================================
// Has Joined Challenge
// =============================================================================

export const hasJoinedChallenge = (groupDetails: GroupDetails, userId: string) => {
    if (!groupDetails || !groupDetails?.participants) {
        return false
    }

    return !!Object.keys(groupDetails.participants).find(id => id === userId)
}

export const notParticipantErrorResponse = async (ctx: Context) => {
    const replyText = `🚫 <b>Not a Participant</b>
It looks like you have not joined the khatam challenge in this group.

🤖 Use /${BotCommands.Join} to join.`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}

export const hasJoinedErrorResponse = async (ctx: Context) => {
    const replyText = `🚫 <b>Already a Participant</b>
It looks like you have joined the khatam challenge in this group.

🤖 Use /${BotCommands.Read} to log the number of pages you have read.`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}


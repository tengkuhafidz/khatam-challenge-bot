import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";
import { GroupDetails } from "../types/index.ts";
import { calculateDaysLeft } from "./calculatePages.ts";
import { parseKhatamDate } from "./date.ts";

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
    if (!hasParticipants(groupDetails)) {
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

// =============================================================================
// Has Participants
// =============================================================================

export const hasParticipants = (groupDetails: GroupDetails) => {
    return (groupDetails && groupDetails?.participants && Object.keys(groupDetails?.participants).length > 0)
}

export const hasNoParticipantsErrorResponse = async (ctx: Context) => {
    const replyText = `🚫 <b>No Participants</b>
It looks like this challenge does not have any participants yet.

🤖 Use /${BotCommands.Join} to join.`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}

// =============================================================================
// Invalid Khatam Date
// =============================================================================

export const isInvalidKhatamDate = (khatamDate: string) => {
    return !parseKhatamDate(khatamDate).isValid() || calculateDaysLeft(khatamDate) < 1
}

export const invalidKhatamDateErrorResponse = async (ctx: Context) => {
    const replyText = `🚫 <b>Invalid Date Format</b>
Please ensure you input a future date with the following format: DD/MM/YYYY (e.g. 21/04/2023)
    
🤖 Use /${BotCommands.EditKhatamDate} to try again.`

    await ctx.reply(replyText, {
        parse_mode: "HTML"
    });
}
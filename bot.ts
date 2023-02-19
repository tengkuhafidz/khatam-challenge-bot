import { Bot } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { CommandTriggers, ReplyTriggers } from "./bot-triggers/index.ts";
import { appConfig } from "./configs/appConfig.ts";
import { BotCommands, commandDescriptions } from "./constants/botCommands.ts";

export const bot = new Bot(appConfig.botApiKey);

// =============================================================================
// Commands
// =============================================================================

bot.api.setMyCommands(
    Object.values(BotCommands).map(botCommand => ({
        command: botCommand, description: commandDescriptions[botCommand]
    }))
)

let khatamDatePromptId: number
let startingPagePromptId: number
let pagesReadPromptId: number

bot.command(BotCommands.StartChallenge, async (ctx) => khatamDatePromptId = await CommandTriggers.startChallenge(ctx));
bot.command(BotCommands.Join, async (ctx) => startingPagePromptId = await CommandTriggers.joinChallenge(ctx));
bot.command(BotCommands.Read, async (ctx) => pagesReadPromptId = await CommandTriggers.read(ctx));


// =============================================================================
// Catch-all Message Reply
// =============================================================================

bot.on("message", async (ctx) => {
    const replyToId = ctx.update?.message?.reply_to_message?.message_id
    if (!replyToId) {
        return
    }

    switch (replyToId) {
        case khatamDatePromptId:
            await ReplyTriggers.saveKhatamDate(ctx)
            return
        case startingPagePromptId:
            await ReplyTriggers.saveParticipantDetails(ctx)
            return
        case pagesReadPromptId:
            await ReplyTriggers.savePagesReadIncrement(ctx)
            return
    }
});

// =============================================================================

bot.start();


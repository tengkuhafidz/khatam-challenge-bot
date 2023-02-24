import { Bot } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { CommandTriggers, ReplyTriggers } from "./bot-triggers/index.ts";
import { appConfig } from "./configs/appConfig.ts";
import { BotCommands, commandDescriptions } from "./constants/botCommands.ts";
import { PromptRes } from "./types/index.ts";
import { CtxDetails } from "./utils/CtxDetails.ts";

export const bot = new Bot(appConfig.botApiKey);

// =============================================================================
// Commands
// =============================================================================

bot.api.setMyCommands(
    Object.values(BotCommands).map(botCommand => ({
        command: botCommand, description: commandDescriptions[botCommand]
    }))
)

let khatamDatePromptRes: PromptRes
let startingPagePromptRes: PromptRes
let pagesReadPromptRes: PromptRes

bot.command(BotCommands.StartChallenge, async (ctx) => khatamDatePromptRes = await CommandTriggers.startChallenge(ctx));
bot.command(BotCommands.Join, async (ctx) => startingPagePromptRes = await CommandTriggers.joinChallenge(ctx));
bot.command(BotCommands.Read, async (ctx) => pagesReadPromptRes = await CommandTriggers.read(ctx));


// =============================================================================
// Catch-all Message Reply
// =============================================================================

bot.on("message", async (ctx) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId, userId } = ctxDetails
    const replyToId = ctx.update?.message?.reply_to_message?.message_id
    if (!replyToId) {
        return
    }

    if (khatamDatePromptRes?.messageId === replyToId) {
        await ReplyTriggers.saveKhatamDate(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (startingPagePromptRes?.messageId === replyToId && startingPagePromptRes.userId === userId) {
        await ReplyTriggers.saveParticipantDetails(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (pagesReadPromptRes?.messageId === replyToId && pagesReadPromptRes.userId === userId) {
        await ReplyTriggers.savePagesReadIncrement(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }
});

// =============================================================================

bot.start();


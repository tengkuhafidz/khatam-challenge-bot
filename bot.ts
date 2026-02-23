import { Bot } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { CommandTriggers, ReplyTriggers } from "./bot-triggers/index.ts";
import { appConfig } from "./configs/appConfig.ts";
import { BotCommands, commandDescriptions } from "./constants/botCommands.ts";
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

bot.command("start", (ctx) => CommandTriggers.howItWorks(ctx));
bot.command(BotCommands.HowItWorks, (ctx) => CommandTriggers.howItWorks(ctx));
bot.command(BotCommands.StartChallenge, async (ctx) => await CommandTriggers.startChallenge(ctx));
bot.command(BotCommands.RestartChallenge, async (ctx) => await CommandTriggers.restartChallenge(ctx));
bot.command(BotCommands.Join, async (ctx) => await CommandTriggers.joinChallenge(ctx));
bot.command(BotCommands.Read2, async (ctx) => await CommandTriggers.read(ctx));
bot.command(BotCommands.UpdateCurrentPage, async (ctx) => await CommandTriggers.updateCurrentPage(ctx));
bot.command(BotCommands.EditKhatamPages, async (ctx) => await CommandTriggers.editKhatamPages(ctx));
bot.command(BotCommands.EditKhatamDate, async (ctx) => await CommandTriggers.editKhatamDate(ctx));
bot.command(BotCommands.ViewKhatamProgress, async (ctx) => await CommandTriggers.viewKhatamProgress(ctx));

// =============================================================================
// Catch-all Message Reply
// =============================================================================

bot.on("message", async (ctx) => {
    const ctxDetails = new CtxDetails(ctx)
    const { chatId } = ctxDetails
    const replyToMessage = ctx.update?.message?.reply_to_message
    if (!replyToMessage) {
        return
    }

    const replyToText = replyToMessage.text || ""
    const replyToId = replyToMessage.message_id

    if (replyToText.startsWith("What is the khatam goal date?") || replyToText.includes("Restarting Challenge...")) {
        await ReplyTriggers.saveKhatamChallengeDetails(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (replyToText.startsWith("How many pages did you read,")) {
        await ReplyTriggers.savePagesReadIncrement(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (replyToText.startsWith("Which page did you complete reading,")) {
        await ReplyTriggers.saveTotalPagesRead(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (replyToText.startsWith("How many pages does this group aim to complete?")) {
        await ReplyTriggers.saveKhatamPages(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (replyToText.startsWith("What is the new khatam goal date?")) {
        await ReplyTriggers.saveKhatamDate(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }
});

// =============================================================================

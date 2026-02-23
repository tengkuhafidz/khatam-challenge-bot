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

let startChallengePromptRes: PromptRes | null
let pagesReadPromptRes: PromptRes | null
let totalPagesPromptRes: PromptRes | null
let khatamPagesPromptRes: PromptRes | null
let editKhatamDatePromptRes: PromptRes | null

bot.command("start", (ctx) => CommandTriggers.howItWorks(ctx));
bot.command(BotCommands.HowItWorks, (ctx) => CommandTriggers.howItWorks(ctx));
bot.command(BotCommands.StartChallenge, async (ctx) => startChallengePromptRes = await CommandTriggers.startChallenge(ctx));
bot.command(BotCommands.RestartChallenge, async (ctx) => startChallengePromptRes = await CommandTriggers.restartChallenge(ctx));
bot.command(BotCommands.Join, async (ctx) => await CommandTriggers.joinChallenge(ctx));
// bot.command(BotCommands.Read, async (ctx) => pagesReadPromptRes = await CommandTriggers.read(ctx));
bot.command(BotCommands.Read2, async (ctx) => pagesReadPromptRes = await CommandTriggers.read(ctx));
bot.command(BotCommands.UpdateCurrentPage, async (ctx) => totalPagesPromptRes = await CommandTriggers.updateCurrentPage(ctx));
bot.command(BotCommands.EditKhatamPages, async (ctx) => khatamPagesPromptRes = await CommandTriggers.editKhatamPages(ctx));
bot.command(BotCommands.EditKhatamDate, async (ctx) => editKhatamDatePromptRes = await CommandTriggers.editKhatamDate(ctx));
bot.command(BotCommands.ViewKhatamProgress, async (ctx) => await CommandTriggers.viewKhatamProgress(ctx));

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

    console.log(`[message] reply received — userId: ${userId}, replyToId: ${replyToId}, pagesReadPromptRes: ${JSON.stringify(pagesReadPromptRes)}`)

    if (startChallengePromptRes?.messageId === replyToId) {
        await ReplyTriggers.saveKhatamChallengeDetails(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (pagesReadPromptRes?.messageId === replyToId && pagesReadPromptRes?.userId === userId) {
        console.log(`[message] pagesRead match — processing savePagesReadIncrement`)
        await ReplyTriggers.savePagesReadIncrement(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (totalPagesPromptRes?.messageId === replyToId && totalPagesPromptRes?.userId === userId) {
        await ReplyTriggers.saveTotalPagesRead(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (khatamPagesPromptRes?.messageId === replyToId) {
        await ReplyTriggers.saveKhatamPages(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }

    if (editKhatamDatePromptRes?.messageId === replyToId) {
        await ReplyTriggers.saveKhatamDate(ctx)
        ctx.api.deleteMessage(chatId!, replyToId)
        return
    }
});

// =============================================================================

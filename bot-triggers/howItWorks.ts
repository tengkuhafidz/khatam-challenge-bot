import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands, commandDescriptions } from "../constants/botCommands.ts";

export const howItWorks = async (ctx: Context) => {
    const startText = `Salaam~ 👋🏽

This bot's aim is to facilitate a group to khatam the Quran together. 💫

<b>How it works:</b>

1️⃣ Add this bot to the group you want to khatam with.
2️⃣ Use /${BotCommands.StartChallenge} to initiate the bot in that group. 
3️⃣ Get members to join the challenge by using /${BotCommands.Join}.
4️⃣ Use /${BotCommands.Read} to log the number of pages you read to track your progress.

<b>Additional Commands:</b>

🤖 Use /${BotCommands.ViewKhatamProgress} to ${commandDescriptions[BotCommands.ViewKhatamProgress].toLowerCase()}
🤖 Use /${BotCommands.UpdateTotal} to ${commandDescriptions[BotCommands.UpdateTotal].toLowerCase()}
🤖 Use /${BotCommands.EditKhatamDate} to ${commandDescriptions[BotCommands.EditKhatamDate].toLowerCase()}
🤖 Use /${BotCommands.EditKhatamPages} to ${commandDescriptions[BotCommands.EditKhatamPages].toLowerCase()}
`

    await ctx.reply(startText, {
        parse_mode: "HTML",
    });
}
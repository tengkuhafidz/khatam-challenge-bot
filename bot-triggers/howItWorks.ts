import { Context } from "https://deno.land/x/grammy@v1.12.0/context.ts";
import { BotCommands } from "../constants/botCommands.ts";

export const howItWorks = async (ctx: Context) => {
    const startText = `Salaam~ 👋🏽

This bot's aim is to facilitate a group to khatam the Quran together. 💫

<b>How it works:</b>

1️⃣ Add this bot to the group you want to khatam with.

2️⃣ Use /${BotCommands.StartChallenge} to initiate the bot in that group. It will then prompt you to specify your group's khatam goal date.

3️⃣ Get members to join the challenge by using /${BotCommands.Join}. Members can specify which page they will be starting from.

4️⃣ Use /${BotCommands.Read} to log the number of pages you read. The bot will help you visualise your progress.
`

    await ctx.reply(startText, {
        parse_mode: "HTML",
    });
}
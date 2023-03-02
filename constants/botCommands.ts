export enum BotCommands {
    StartChallenge = "start_khatam_challenge",
    Join = "join_khatam_challenge",
    Read = "read_quran",
    HowItWorks = "how_khatam_challenge_bot_works",
    EditKhatamPages = "edit_khatam_pages_goal"
    // RestartChallenge = "restart_khatam_challenge"
    // EditEndDate = "edit_khatam_date",
    // SetTimezone = "set_timezone",
    // SetReminder = "set_khatam_reminder"
}

export const commandDescriptions = {
    [BotCommands.StartChallenge]: "Start Khatam challenge for the group",
    [BotCommands.Join]: "Join Khatam challenge",
    [BotCommands.Read]: "Log number of pages read ",
    [BotCommands.HowItWorks]: "Explanation of how this bot works",
    [BotCommands.EditKhatamPages]: "Edit number of pages the group aims to complete"
    // [BotCommands.EditEndDate]: "Edit Khatam date",
    // [BotCommands.SetReminder]: "Set daily reminder to read",
}



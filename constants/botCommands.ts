export enum BotCommands {
    StartChallenge = "start_khatam_challenge",
    Join = "join_khatam_challenge",
    Read = "read_quran_pages",
    HowItWorks = "how_khatam_challenge_bot_works",
    EditKhatamPages = "edit_khatam_pages",
    EditKhatamDate = "edit_khatam_date",
    ViewKhatamProgress = "view_khatam_progress"
    // RestartChallenge = "restart_khatam_challenge"
    // SetTimezone = "set_timezone",
    // SetReminder = "set_khatam_reminder"
}

export const commandDescriptions = {
    [BotCommands.StartChallenge]: "Start khatam challenge for the group",
    [BotCommands.Join]: "Join khatam challenge",
    [BotCommands.Read]: "Log the number of pages read",
    [BotCommands.HowItWorks]: "Explanation of how this bot works",
    [BotCommands.EditKhatamPages]: "Edit the number of pages the group aims to complete",
    [BotCommands.EditKhatamDate]: "Edit the khatam goal date",
    [BotCommands.ViewKhatamProgress]: "View the group's khatam progress"
    // [BotCommands.SetReminder]: "Set daily reminder to read",
}



import { joinChallenge } from "./joinChallenge.ts";
import { read, savePagesReadIncrement } from "./read.ts";
import { howItWorks } from "./howItWorks.ts";
import { editKhatamPages, saveKhatamPages } from "./editKhatamPages.ts";
import { editKhatamDate, saveKhatamDate } from "./editKhatamDate.ts";
import { saveKhatamChallengeDetails, startChallenge } from "./startChallenge.ts";
import { viewKhatamProgress } from "./viewKhatamProgress.ts";

export const CommandTriggers = {
    startChallenge,
    joinChallenge,
    read,
    howItWorks,
    editKhatamPages,
    editKhatamDate,
    viewKhatamProgress
};

export const ReplyTriggers = {
    saveKhatamChallengeDetails,
    savePagesReadIncrement,
    saveKhatamPages,
    saveKhatamDate
}

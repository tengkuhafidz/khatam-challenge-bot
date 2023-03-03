import { joinChallenge } from "./joinChallenge.ts";
import { read, savePagesReadIncrement } from "./read.ts";
import { howItWorks } from "./howItWorks.ts";
import { editKhatamPages, saveKhatamPages } from "./editKhatamPages.ts";
import { editKhatamDate, saveKhatamDate } from "./editKhatamDate.ts";
import { saveKhatamChallengeDetails, startChallenge } from "./startChallenge.ts";

export const CommandTriggers = {
    startChallenge,
    joinChallenge,
    read,
    howItWorks,
    editKhatamPages,
    editKhatamDate
};

export const ReplyTriggers = {
    saveKhatamChallengeDetails,
    savePagesReadIncrement,
    saveKhatamPages,
    saveKhatamDate
}

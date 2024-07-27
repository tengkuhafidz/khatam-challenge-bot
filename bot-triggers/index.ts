import { joinChallenge } from "./joinChallenge.ts";
import { read, savePagesReadIncrement } from "./read.ts";
import { updateCurrentPage, saveTotalPagesRead } from "./updateTotalPages.ts";
import { howItWorks } from "./howItWorks.ts";
import { editKhatamPages, saveKhatamPages } from "./editKhatamPages.ts";
import { editKhatamDate, saveKhatamDate } from "./editKhatamDate.ts";
import { saveKhatamChallengeDetails, startChallenge } from "./startChallenge.ts";
import { restartChallenge } from "./restartChallenge.ts";
import { viewKhatamProgress } from "./viewKhatamProgress.ts";

export const CommandTriggers = {
    startChallenge,
    restartChallenge,
    joinChallenge,
    read,
    updateCurrentPage,
    howItWorks,
    editKhatamPages,
    editKhatamDate,
    viewKhatamProgress
};

export const ReplyTriggers = {
    saveKhatamChallengeDetails,
    savePagesReadIncrement,
    saveTotalPagesRead,
    saveKhatamPages,
    saveKhatamDate
}

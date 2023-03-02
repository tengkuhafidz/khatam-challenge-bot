import { joinChallenge } from "./joinChallenge.ts";
import { read, savePagesReadIncrement } from "./read.ts";
import { howItWorks } from "./howItWorks.ts";
import { editKhatamPages, saveKhatamPages } from "./editKhatamPages.ts";

import { saveKhatamDate, startChallenge } from "./startChallenge.ts";

export const CommandTriggers = {
    startChallenge,
    joinChallenge,
    read,
    howItWorks,
    editKhatamPages
};

export const ReplyTriggers = {
    saveKhatamDate,
    savePagesReadIncrement,
    saveKhatamPages
}

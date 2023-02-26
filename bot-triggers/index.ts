import { joinChallenge, saveParticipantDetails } from "./joinChallenge.ts";
import { read, savePagesReadIncrement } from "./read.ts";
import { howItWorks } from "./howItWorks.ts";
import { saveKhatamDate, startChallenge } from "./startChallenge.ts";

export const CommandTriggers = {
    startChallenge,
    joinChallenge,
    read,
    howItWorks
};

export const ReplyTriggers = {
    saveKhatamDate,
    saveParticipantDetails,
    savePagesReadIncrement
}

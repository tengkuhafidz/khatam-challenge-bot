import { joinChallenge, saveParticipantDetails } from "./joinChallenge.ts";
import { read, savePagesReadIncrement } from "./read.ts";
import { saveKhatamDate, startChallenge } from "./startChallenge.ts";

export const CommandTriggers = {
    startChallenge,
    joinChallenge,
    read,

};

export const ReplyTriggers = {
    saveKhatamDate,
    saveParticipantDetails,
    savePagesReadIncrement
}

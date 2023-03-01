export interface Participants {
    [key: string]: ParticipantDetails
}

export interface ParticipantDetails {
    name: string
    pagesRead: number
    lastReadAt?: number
}

export interface PromptRes {
    messageId: number,
    userId: string
}

export interface GroupDetails {
    chatId: string
    createdAt: number
    khatamDate: string
    participants: Participants
}
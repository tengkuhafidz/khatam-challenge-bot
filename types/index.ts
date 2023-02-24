export interface Participants {
    [key: string]: ParticipantDetails
}

export interface ParticipantDetails {
    name: string
    pagesRead: number
    lastReadAt: number
}

export interface PromptRes {
    messageId: number,
    userId: string
}
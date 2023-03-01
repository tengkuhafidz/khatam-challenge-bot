import dayjs from "https://esm.sh/dayjs";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { appConfig } from "../configs/appConfig.ts";

const firebaseApp = initializeApp(appConfig.firebaseConfig);
const db = getFirestore(firebaseApp);

const saveKhatamDate = async (chatId: string, khatamDate: string) => {
    try {
        const dbRef = doc(db, "groups", chatId)
        await setDoc(dbRef, {
            chatId: chatId,
            khatamDate: khatamDate,
            createdAt: dayjs().unix()
        })

    } catch (error) {
        console.log("[ERROR] saveKhatamDate", JSON.stringify(error))
    }
}

const saveParticipantDetails = async (chatId: string, userName: string, userId: string, pagesRead: number) => {
    try {
        const dbRef = doc(db, "groups", chatId)

        await updateDoc(dbRef, {
            [`participants.${userId}`]: {
                name: userName,
                pagesRead
            }
        })
    } catch (error) {
        console.log("[ERROR] saveParticipantDetails", JSON.stringify(error))
    }
}

const savePagesReadIncrement = async (chatId: string, userId: string, pagesRead: number) => {
    try {
        const dbRef = doc(db, "groups", chatId)

        await updateDoc(dbRef, {
            [`participants.${userId}.pagesRead`]: increment(pagesRead),
            [`participants.${userId}.lastReadAt`]: dayjs().unix()
        })
    } catch (error) {
        console.log("[ERROR] savePagesReadIncrement", JSON.stringify(error))
    }
}

const getGroupDetails = async (chatId: string) => {
    try {
        const docRef = doc(db, "groups", chatId)
        const docSnap = await getDoc(docRef);
        return docSnap.data()
    } catch (error) {
        console.log("[ERROR] getGroupDetails", error)
        return undefined
    }
}

export const DbQueries = {
    saveKhatamDate,
    saveParticipantDetails,
    savePagesReadIncrement,
    getGroupDetails
}
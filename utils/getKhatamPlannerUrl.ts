export const getKhatamPlannerUrl = (daysLeft: number, totalPagesRead: number) => {
    return `https://khatam-planner.jariyah.app?days=${daysLeft}startingPage=${totalPagesRead + 1}`
}
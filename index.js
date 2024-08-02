const express = require("express")
const app = express()

const createDateFromString = (dateString) => {
    const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

    const [dayPart, timePart] = dateString.split(" à ")
    const [day, monthName, year] = dayPart.split(" ")
    const [hours, minutes] = timePart.split(":")

    const month = monthNames.indexOf(monthName.toLowerCase())

    return new Date(year, month, day, hours, minutes)
}

const getDayPosition = (day) => {
    const daysPositions = Array
        .from({length: 7}, (_, i) => {
            return new Date(0, 0, i).toLocaleString("fr-FR", {weekday: "long"}).toLowerCase()
        })
        .reduce((acc, key, index) => {
            acc[key] = index
            return acc
        }, {})

    return daysPositions[day]
}

app.get("/", (req, res) => {
    res.status(200).send({message: "Welcome! Go to /get-started endpoint to learn how to use this tool. Learn more about this project on https://github.com/augustin-pasq/Alarm."})
})

app.get("/get-started", (req, res) => {
    res.status(200).send({message: "First install the Siri Shortcut available at the /shortcut endpoint. Then just run the Shortcut to get the remaining time before your next alarm. Disclaimer: currently, this tool works only if the iPhone language is set to French."})
})

app.get("/shortcut", (req, res) => {
    res.status(200).send({message: "https://www.icloud.com/shortcuts/da92b99bbe3b456b86ea73eddac95638"})
})

app.get("/compute", (req, res) => {
    let response = {message: "", success: null}

    if (req.headers.data !== undefined) {
        try {
            const data = JSON.parse(req.headers.data)

            if (Object.keys(data).length > 0) {
                let nextAlarm
                for (const alarm of Object.values(data)) {
                    const now = createDateFromString(alarm.device_date)
                    const [hours, minutes] = alarm.value.split(':')

                    if (alarm.recurrence === '') {
                        const today = new Date(new Date().setHours(hours, minutes, 0, 0))
                        const tomorrow = new Date((new Date()).setDate(today.getDate() + 1))

                        nextAlarm = now > today ? tomorrow - now : today - now
                    } else {
                        const recurrenceDates = []
                        for (const day of alarm.recurrence.split('\n')) {
                            const today = new Date(new Date().setHours(hours, minutes, 0, 0))

                            let daysDifference = getDayPosition(day.toLowerCase()) - today.getDay()
                            if (daysDifference <= -1) daysDifference += 7

                            const nextRecurrenceAlarm = new Date(today.setDate(today.getDate() + daysDifference))

                            if (nextRecurrenceAlarm > now) recurrenceDates.push(nextRecurrenceAlarm - now)
                        }

                        nextAlarm = Math.min(...recurrenceDates)
                    }
                }

                let responseComponents = {jour: Math.floor(nextAlarm / (24 * 60 * 60 * 1000)), heure: Math.floor((nextAlarm % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)), minute: Math.floor((nextAlarm % (60 * 60 * 1000)) / (60 * 1000)) + (Math.floor((nextAlarm % (60 * 1000)) / 1000) === 0 ? 0 : 1)}
                if (responseComponents.minute === 60) {
                    responseComponents.minute = 0
                    responseComponents.heure++
                }

                if (responseComponents.jour > 0) {
                    response.message = `Votre prochaine alarme sonnera dans ${responseComponents.jour} jour${responseComponents.jour === 1 ? "" : "s"}.`
                } else if (responseComponents.minute === 0) {
                    response.message = `Votre prochaine alarme sonnera dans ${responseComponents.heure} heure${responseComponents.heure === 1 ? "" : "s"}.`
                } else if (responseComponents.heure === 0) {
                    response.message = `Votre prochaine alarme sonnera dans ${responseComponents.minute} minute${responseComponents.minute === 1 ? "" : "s"}.`
                } else {
                    response.message = `Votre prochaine alarme sonnera dans ${responseComponents.heure} heure${responseComponents.heure === 1 ? "" : "s"} et ${responseComponents.minute} minute${responseComponents.minute === 1 ? "" : "s"}.`
                }
            } else {
                response.message = "Aucune alarme n'est activée."
            }

            response.success = 1
        } catch(e) {
            response.message = "Please be sure to use the Siri Shortcut or provide the expected JSON object."
        }
    } else {
        response.message = "Please be sure to use the Siri Shortcut or provide the expected JSON object."
    }

    res.status(200).send(response)
})

app.listen(3998)
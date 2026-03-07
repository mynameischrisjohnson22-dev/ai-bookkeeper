import cron from "node-cron"
import { runRecurringEngine } from "./recurring.engine.js"

export const startRecurringRunner = () => {

  cron.schedule("0 0 * * *", async () => {

    console.log("Running recurring transactions engine")

    try {

      await runRecurringEngine()

    } catch (err) {

      console.error("Recurring job failed:", err)

    }

  })

}
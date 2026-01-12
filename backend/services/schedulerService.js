import cron from "node-cron";
import fs from "fs";
import path from "path";

import { attributeSources } from "./attributionService.js";
import {
  updateHourlyProfile,
  updateDailyPollutionSummary,
  saveSourceAttributionSnapshot,
  updateDailyWeatherSummary
} from "./aggregationService.js";

import { notificationSettings } from "./notificationStore.js";
import { generateDailySummaryReport } from "./dailySummaryService.js";
import { sendEmail } from "./emailService.js";

import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wardConfigPath = path.join(__dirname, "../config/wardConfig.json");
const wards = JSON.parse(fs.readFileSync(wardConfigPath, "utf-8"));



export function startSchedulers() {
  startHourlyAggregation();
  startDailyAggregation();
  startDailySummaryNotification(); // 🔥 NEW
}



function startHourlyAggregation() {
  cron.schedule("0 * * * *", async () => {
    console.log("[Scheduler] Hourly job started");

    for (const ward of wards) {
      try {
        const result = await attributeSources({
          ward_id: ward.ward_id
        });

        await updateHourlyProfile({
          ward_id: ward.ward_id,
          snapshot: {
            timestamp: new Date(),
            aqi_category: result.aqi_category,
            recommendation: result.recommendation,
            priority: result.priority,
            confidence: result.confidence
          }
        });
      } catch (err) {
        console.warn(
          `[Scheduler] Hourly skip for ward ${ward.ward_id}:`,
          err.message
        );
      }
    }

    console.log("[Scheduler] Hourly job completed");
  });
}



function startDailyAggregation() {
  cron.schedule("30 0 * * *", async () => {
    console.log("[Scheduler] Daily job started");

    for (const ward of wards) {
      try {
        await updateDailyPollutionSummary({
          ward_id: ward.ward_id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        });

        await saveSourceAttributionSnapshot({
          ward_id: ward.ward_id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        });
      } catch (err) {
        console.warn(
          `[Scheduler] Daily aggregation skip for ward ${ward.ward_id}:`,
          err.message
        );
      }
    }

    try {
      await updateDailyWeatherSummary({
        date: new Date(Date.now() - 24 * 60 * 60 * 1000)
      });
    } catch (err) {
      console.warn("[Scheduler] Daily weather aggregation failed:", err.message);
    }

    console.log("[Scheduler] Daily job completed");
  });
}


function startDailySummaryNotification() {
  cron.schedule("* * * * *", async () => {
    console.log("[Scheduler] Daily Summary Check");

    if (!notificationSettings.dailySummary) {
      console.log("[Scheduler] Daily summary disabled");
      return;
    }

    const summaryData = await generateDailySummaryReport();

    if (notificationSettings.emailNotifications) {
      await sendEmail({
        to: notificationSettings.email,
        subject: "Delhi Pollution – Daily Ward Summary",
        summaryData
      });
    } else {
      console.log("[Daily Summary Report]", summaryData);
    }
  });
}

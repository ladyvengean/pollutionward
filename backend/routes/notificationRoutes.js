import express from "express";
import { notificationSettings } from "../services/notificationStore.js";
import { generateDailySummaryReport } from "../services/dailySummaryService.js";
import { sendEmail } from "../services/emailService.js";



const router = express.Router();

router.post("/update", (req, res) => {
  const { dailySummary, emailNotifications } = req.body;

  if (typeof dailySummary === "boolean") {
    notificationSettings.dailySummary = dailySummary;
  }

  if (typeof emailNotifications === "boolean") {
    notificationSettings.emailNotifications = emailNotifications;
  }

  return res.json({
    message: "Notification preferences updated",
    settings: notificationSettings
  });
});
router.post("/sanyasaxenaaa@gmail.com", async (req, res) => {
    const summary = await generateDailySummaryReport();
  
    await sendEmail({
      to: process.env.EMAIL_TO,
      subject: "TEST – Daily Pollution Summary",
      summaryData: summary
    });
  
    res.json({ success: true });
  });
  

export default router;

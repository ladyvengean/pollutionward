import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { attributeSources } from "./attributionService.js";

/* -------------------- Path Setup -------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------- Load Ward Config -------------------- */

const wardConfigPath = path.join(__dirname, "../config/wardConfig.json");
const wards = JSON.parse(fs.readFileSync(wardConfigPath, "utf-8"));

/* -------------------- Daily Summary Generator -------------------- */

export async function generateDailySummaryReport() {
    const report = [];
  
    for (const ward of wards) {
      try {
        const data = await attributeSources({ ward_id: ward.ward_id });
  
        report.push({
          Ward: data.ward,
          AQI: data.aqi,
          Category: data.aqi_category,
          Priority: data.priority
        });
      } catch (err) {
        report.push({
          Ward: ward.name,
          AQI: "N/A",
          Category: "Unavailable",
          Priority: "Low"
        });
      }
    }
  
    // 🔐 GUARANTEE array return
    return Array.isArray(report) ? report : [];
  }
  

//   return {
//     date: new Date().toISOString().split("T")[0],
//     total_wards: report.length,
//     wards: report
//   };


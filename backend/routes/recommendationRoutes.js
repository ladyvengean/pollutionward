import express from "express";
import { attributeSources } from "../services/attributionService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { ward } = req.query;
    if (!ward) {
      return res.status(400).json({ error: "ward is required" });
    }

    const data = await attributeSources({ ward_id: ward });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

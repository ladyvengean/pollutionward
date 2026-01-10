import express from "express";
import axios from "axios";
import { getallComplaints, createComplaint } from "../controllers/complaintController.js";

const router = express.Router();
router.get("/complaints", getallComplaints);
router.post("/complaints", createComplaint);

export default router;
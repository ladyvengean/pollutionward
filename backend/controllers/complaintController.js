import Complaints from "../models/Complaints.js";

export const getallComplaints = async (req, res) => {
    try {
        const complaints = await Complaints.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: complaints, count: complaints.length });
    } catch (err) {
        res.status(500).json({ success: false, message: "failed to fetch complaints", error: err.message });
    }
};

export const createComplaint = async (req, res) => {
    try {
        const { title, category, ward, location, description, photo } = req.body;
        if (!title || !category || !ward || !location || !description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const complaint = await Complaints.create({ title, category, ward, location, description, photo });
        res.status(201).json({ success: true, data: complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: "failed to create complaint", error: err.message });
    }
};
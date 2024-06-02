import express from "express";

import {
  addResturent,
  getAllItems,
  getResturentById,
  updateResturent,
  deleteResturent,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.get("/", getAllItems);
router.post("/addResturent", addResturent);
router.put("/updateResturent/:id", updateResturent);
router.delete("/delete/:id", deleteResturent);
router.get("/:id", getResturentById);

export default router;

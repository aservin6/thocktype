import express, { Router } from "express";
import {
  getUsersResults,
  postResult,
} from "../controllers/result.controller.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";

const router: Router = express.Router();

router.get("/leaderboard/:mode", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

router.get("/me/results", authenticateToken, getUsersResults);

router.post("/results", authenticateToken, postResult);

export { router as resultsRoutes };

import express from "express";

const router = express.Router();

router.get("/leaderboard/:mode", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

router.post("/results", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

export { router as resultsRoutes };

import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

router.post("/signin", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

router.post("/signout", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

router.get("/me", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

export { router as authRoutes };


  import crypto from "node:crypto";
  import GuestSession from "../models/guestSession.model.js";

  const verifyGuestSession = async (req, res, next) => {
    try {
      const token = req.cookies?.guestToken;

      if (!token) {
        return res.status(401).json({
          message: "Guest session not found",
        });
      }

      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const guestSession = await GuestSession.findOne({
        tokenHash,
        expiresAt: { $gt: new Date() },
      });

      if (!guestSession) {
        return res.status(401).json({
          message: "Invalid or expired guest session",
        });
      }

      req.guestSession = guestSession;

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Failed to verify guest session",
      });
    }
  };

  export default verifyGuestSession;

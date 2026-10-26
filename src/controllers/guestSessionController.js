import crypto from "node:crypto";
import GuestSession from "../models/guestSession.model.js";

export const createGuestSession = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await GuestSession.create({
      tokenHash,
      expiresAt,
    });

    res.cookie("guestToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: expiresAt,
    });

    res.status(201).json({
      message: "Guest session created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create guest session",
    });
  }
};



export const checkGuestSession = async (req, res) => {
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
        message: "Guest session is invalid or expired",
      });
    }

    return res.status(200).json({
      message: "Guest session is valid",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to check guest session",
    });
  }
};

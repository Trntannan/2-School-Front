import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const dbPath = path.resolve("db.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { token, fullName, kidCount, school, bio, profilePic } = req.body;

    // Verify JWT token
    const decoded = jwt.verify(token, "your_jwt_secret");
    const userId = decoded.id;

    // Load existing users
    let rawData = fs.readFileSync(dbPath);
    let db = JSON.parse(rawData);

    // Find user by ID
    const userIndex = db.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile data
    db.users[userIndex].profile = {
      fullName,
      kidCount,
      school,
      bio,
      profilePic,
    };

    // Save updated users back to the JSON file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res
      .status(200)
      .json({
        message: "Profile completed successfully",
        profile: db.users[userIndex].profile,
      });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

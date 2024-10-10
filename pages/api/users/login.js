import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const dbPath = path.resolve("db.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { emailOrUsername, password } = req.body;

    // Load existing users
    let rawData = fs.readFileSync(dbPath);
    let db = JSON.parse(rawData);

    // Find user by email or username
    const user = db.users.find(
      (user) =>
        (user.email === emailOrUsername || user.username === emailOrUsername) &&
        user.password === password
    );

    if (user) {
      // Create JWT token
      const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

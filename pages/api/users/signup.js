import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const dbPath = path.resolve("db.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    // Load existing users
    let rawData = fs.readFileSync(dbPath);
    let db = JSON.parse(rawData);

    // Check if user already exists
    if (db.users.some((user) => user.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Add new user
    const newUser = { id: Date.now(), username, email, password };
    db.users.push(newUser);

    // Save updated users back to the JSON file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Create JWT token
    const token = jwt.sign({ id: newUser.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, token });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

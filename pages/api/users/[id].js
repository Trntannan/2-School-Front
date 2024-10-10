import fs from "fs";
import path from "path";

const dbPath = path.resolve("db.json");

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Load existing users
    let rawData = fs.readFileSync(dbPath);
    let db = JSON.parse(rawData);

    // Find user by ID
    const user = db.users.find((user) => user.id == id); // Note '==' comparison with string

    if (user) {
      res.status(200).json({ profile: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

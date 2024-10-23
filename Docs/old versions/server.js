const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { MongoClient } = require("mongodb");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATA_DIR = "./user_data";
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const mongoURI =
  "mongodb+srv://trntannan1:Trentas.10@cluster0.88mbg.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "user_data";

async function connectToMongoDB() {
  const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB server");

    const db = client.db(DATABASE_NAME);

    // Check if the database exists; if not, create it
    const dbList = await client.db().admin().listDatabases();
    const databaseExists = dbList.databases.some(
      (db) => db.name === DATABASE_NAME
    );

    if (!databaseExists) {
      await db.createCollection("users");
      console.log("Created 'users' collection in the database");
    }

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function generateToken(userId) {
  const token = jwt.sign({ userId }, "your_jwt_secret", { expiresIn: "1h" });
  return token;
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    return decoded;
  } catch (error) {
    return null;
  }
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return res.sendStatus(403);
  }

  req.userId = decoded.userId;
  next();
}

app
  .prepare()
  .then(async () => {
    const db = await connectToMongoDB();

    const usersCollection = db.collection("users");

    const server = express();
    server.use(bodyParser.json());

    server.post("/api/register", async (req, res) => {
      const { username, email, password } = req.body;

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
      }

      const userId = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { userId, username, email, password: hashedPassword };

      await usersCollection.insertOne(newUser);

      const token = await generateToken(userId);
      res.send({ message: "User registered successfully", userId, token });
    });

    server.post("/api/login", async (req, res) => {
      const { email, password } = req.body;

      const user = await usersCollection.findOne({ email, password });
      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      const token = await generateToken(user.userId);
      res.send({
        message: "Login successful",
        user: { userId: user.userId, email: user.email },
        token,
      });
    });

    server.post(
      "/api/profile",
      authenticateToken,
      upload.single("profilePic"),
      async (req, res) => {
        const { userId } = req;
        const { fullName, mobile, school, bio } = req.body;

        const user = await usersCollection.findOne({ userId });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        const updatedProfile = { fullName, mobile, school, bio };

        if (req.file) {
          updatedProfile.profilePic = req.file.buffer.toString("base64");
        }

        await usersCollection.updateOne(
          { userId },
          { $set: { profile: updatedProfile } }
        );

        res.send({ message: "Profile updated successfully" });
      }
    );

    server.get("/api/profile/:userId", authenticateToken, async (req, res) => {
      const { userId } = req.params;

      const user = await usersCollection.findOne({ userId });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send(user.profile);
    });

    server.all("*", (req, res) => handle(req, res));

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

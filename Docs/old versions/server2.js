const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const { MongoClient, Binary } = require("mongodb");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATABASE_URL = "mongodb+srv://trntannan1:Trentas.10@cluster0.gubddcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0i";
// const DATABASE_NAME = "user_data"; // Adjust to your database name

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    // MongoDB Client
    let db;

    // Connect to MongoDB
    MongoClient.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
      }
      console.log("Connected to MongoDB");
      db = client.db(DATABASE_NAME);
    });

    // Register endpoint
    server.post("/api/register", async (req, res) => {
      const { username, email, password } = req.body;

      try {
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
          return res.status(400).send({ message: "User already exists" });
        }

        const userId = crypto.randomBytes(16).toString("hex");
        const newUser = {
          userId,
          username,
          email,
          password,
        };
        await db.collection("users").insertOne(newUser);
        res.send({ message: "User registered successfully", userId });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Login endpoint
    server.post("/api/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        const user = await db.collection("users").findOne({ email });
        if (!user || user.password !== password) {
          return res.status(401).send({ message: "Invalid credentials" });
        }

        res.send({
          message: "Login successful",
          user: { userId: user.userId, email: user.email },
        });
      } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Profile update endpoint
    server.post(
      "/api/profile",
      upload.single("profilePic"),
      async (req, res) => {
        const { userId, fullName, mobile, school, bio } = req.body;

        try {
          const filter = { userId };
          const updateDoc = {
            $set: {
              profile: { fullName, mobile, school, bio },
            },
          };

          if (req.file) {
            updateDoc.$set.profilePic = {
              data: new Binary(req.file.buffer),
              contentType: req.file.mimetype,
            };
          }

          const result = await db.collection("users").updateOne(filter, updateDoc);
          if (result.modifiedCount === 0) {
            return res.status(404).send({ message: "User not found" });
          }

          res.send({ message: "Profile updated successfully" });
        } catch (error) {
          console.error("Error updating profile:", error);
          res.status(500).send({ message: "Internal server error" });
        }
      }
    );

    // Fetch user profile data endpoint
    server.get("/api/profile/:userId", async (req, res) => {
      const { userId } = req.params;

      try {
        const user = await db.collection("users").findOne({ userId });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send(user.profile);
      } catch (error) {
        console.error("Error retrieving profile data:", error);
        res.status(500).send({ message: "Internal server error" });
      }
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

const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DATABASE_URL = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

let usersCollection;

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    let db;

    MongoClient.connect(
      DATABASE_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, client) => {
        if (err) {
          console.error("Error connecting to MongoDB:", err);
          process.exit(1);
        }

        try {
          await client.connect();
          console.log("Connected to MongoDB");

          db = client.db(DATABASE_NAME);
          dblist = await client.db().admin().listDatabases();
          const databaseExists = dblist.databases.some(
            (db) => db.name === DATABASE_NAME
          );

          if (!databaseExists) {
            await db.createCollection("users");
            console.log("Created 'users' collection");
          }

          usersCollection = db.collection("users");

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

          server.post("/api/register", async (req, res) => {
            const { username, email, password } = req.body;

            try {
              const existingUser = await db
                .collection("users")
                .findOne({ email });
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
              res.status(200).send({
                message: "User registered successfully",
                user: newUser,
              });
            } catch (error) {
              console.error("Error registering user:", error);
              res.status(500).send({ message: "Internal server error" });
            }
          });

          server.all("*", (req, res) => handle(req, res));

          server.listen(3000, (err) => {
            if (err) throw err;
            console.log("> Ready on http://localhost:3000");
          });
        } catch (error) {
          console.error("Error connecting to MongoDB:", error);
          process.exit(1);
        }
      }
    );
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

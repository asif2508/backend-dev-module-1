const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt')
const app = express();
require("dotenv").config();
// middleware

app.use(cors());
app.use(express.json());

// database
// get,post,delete, update

const databaseURL = process.env.DB_URL;

console.log("db", databaseURL);
const saltRounds = 10
const main = async () => {
  try {
    const client = new MongoClient(databaseURL);
    await client.connect();
    console.log("database connected");
    const database = client.db("web-dev");
    const Users = database.collection("users");

    app.post("/signup", async (req, res) => {
      const data = req.body;
      console.log(data.email, "data");
      const isExist = await Users.findOne({ email: data.email });
      if (isExist) {
        res.send({
          status: "failed",
          message: "User already exists with this email!",
        });
      } else {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(data.password, salt, async function(err, hash) {
            const result = await Users.insertOne({...data, password: hash});
            if (result) {
              res.send({
                status: "success",
                message: "user created successfully",
                data: result,
              });
            } else {
              res.send("error");
            }
          });
      });
        
      }
    });

    app.get("/get-users", async (req, res) => {
      const result = await Users.find({}).toArray();
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
};

main();

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

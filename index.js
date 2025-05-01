const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const app = express();
require("dotenv").config();
// middleware

app.use(cors());
app.use(express.json());

// database
// get,post,delete, update

const databaseURL = process.env.DB_URL;

console.log("db", databaseURL);
const saltRounds = 10;
const main = async () => {
  try {
    const client = new MongoClient(databaseURL);
    await client.connect();
    console.log("database connected");
    const database = client.db("web-dev");
    const Users = database.collection("users");
    const Products = database.collection("products");

    // signup
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
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(data.password, salt, async function (err, hash) {
            const result = await Users.insertOne({ ...data, password: hash });
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

    // signin
    app.post("/signin", async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        res.send({
          status: false,
          message: "Email and Password is required!",
        });

        return;
      }

      const isExist = await Users.findOne({ email: email });
      if (!isExist) {
        res.send({
          status: false,
          message: "Wrong email!",
        });
        return;
      }

      // Load hash from your password DB.
      bcrypt.compare(password, isExist?.password, function (err, result) {
        if (result) {
          res.send({
            status: true,
            message: "Login successful",
            data: isExist,
          });
        } else {
          res.send({
            status: false,
            message: "Invalid password!",
          });
        }
      });
    });

    // -----------------products api----------------------
    // create product
    app.post("/create-product", async (req, res) => {
      const payload = req.body;
      const result = await Products.insertOne(payload);
      if (result) {
        res.send({
          status: true,
          message: "Product created successfully",
          data: result,
        });
      } else {
        res.send({
          status: false,
          message: "Failed to create the product!",
        });
      }
    });

    // get api to get all products
    app.get("/get-products", async (req, res) => {
      const result = await Products.find({}).toArray();
      res.send({
        status: true,
        message: "Products fetched successfully!",
        data: result,
      });
    });

    // get a single product by id
    app.get("/get-product-by-id/:productId", async (req, res) => {
      const id = req.params.productId;
      const result = await Products.findOne({ _id: new ObjectId(id) });

      res.send({
        status: true,
        message: "Product by id fetched successfully!",
        data: result,
      });
    });

    // delete product
    app.delete("/delete-product/:productId", async (req, res) => {
      const id = req.params.productId;
      const result = await Products.deleteOne({ _id: new ObjectId(id) });

      if (result) {
        res.send({
          status: true,
          message: "Product deleted successfully!",
          data: result,
        });
      } else {
        res.send({
          status: false,
          message: "Failed to delete the product",
        });
      }
    });

    // put and patch-> updating the product
    app.patch("/update-product-by-id/:productId", async (req, res) => {
      const id = req.params.productId;
      const payload = req.body;
      const result = await Products.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: payload,
        },
        { upsert: true }
      );

      
      if (result) {
        res.send({
          status: true,
          message: "Product updated successfully!",
          data: result,
        });
      } else {
        res.send({
          status: false,
          message: "Failed to update the product",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

main();

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

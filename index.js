const express = require("express");
const cors = require("cors");
const app = express();

// middleware

app.use(cors());
app.use(express.json());

// get,post,delete, update

app.get("/", (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        img: "my image",
        name: "my name",
      },
    ],
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

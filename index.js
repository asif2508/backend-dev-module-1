const express = require("express");
const cors = require("cors");
const app = express();

// middleware

app.use(cors());
app.use(express.json());

// get,post,delete, update

app.get("/", (req, res) => {
  res.send("This is get request");
})

app.post('/', (req, res)=>{
  res.send("This is post request")
})

app.delete('/', (req, res)=>{
  res.send("This is delete request")
})

app.patch('/', (req, res)=>{
  res.send("This is update request")
})

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

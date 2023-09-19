import express from "express";
const app = express();

const PORT = 3333;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Hello Word"
  })
});

app.listen(PORT, () => {
  console.log("listening on", PORT);
});
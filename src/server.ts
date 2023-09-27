import express from "express";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;

import { cartRoute } from "./routes/cart.route";
import { userRoute } from "./routes/user.route";
import { productRoute } from "./routes/product.route";

const corsOptions = {
  origin: "https://mecart.onrender.com"
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/cart", cartRoute);
app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(PORT, () => console.log("listening on", PORT));
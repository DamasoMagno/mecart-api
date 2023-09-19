import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

import { cartRoute } from "./routes/cart.route";
import { userRoute } from "./routes/user.route";
import { productRoute } from "./routes/product.route copy";

app.use(express.json());

app.use("/cart", cartRoute);
app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(PORT, () => console.log("listening on", PORT));
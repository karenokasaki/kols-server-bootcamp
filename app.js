require("dotenv").config();
require("./config/db.config")();
const cors = require("cors")
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL }));


const userRouter = require("./routes/users.routes");
app.use("/users", userRouter);

const businessRouter = require("./routes/business.routes");
app.use("/business", businessRouter);

const productsRouter = require("./routes/products.routes");
app.use("/products", productsRouter);

app.listen(Number(process.env.PORT) || 3000, () => {
  console.log(`Server up and ruining at - port: ${process.env.PORT}`);
});

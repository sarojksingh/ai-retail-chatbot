const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//Register Product routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

//Register Auth routes
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

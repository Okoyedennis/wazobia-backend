const express = require("express");
const cors = require("cors");
const { authRoutes } = require("./routes/auth");
const { card } = require("./routes/card");
require("./db/mongoose");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/card", card);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

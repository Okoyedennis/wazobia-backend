const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("ESTABLISHED CONECTION TO DATABASE!"))
  .catch((err) => console.error(err));

mongoose.connection.on("disconnected", () =>
  console.log("DATABASE CONNECTION DISCONNECTED!")
);

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

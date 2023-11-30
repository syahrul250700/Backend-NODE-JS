const Express = require("express");
require("dotenv").config();
const UsersRoutes = require("./routes/users_routes.js");
const logMiddleware = require("./middleware/logMiddleware.js");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = Express();

app.use(logMiddleware);
app.use(Express.json());

app.route("/").get((req, res) => {
  res.status(200).json({
    status: true,
    code: res.statusCode,
    message: `Server API is running on ${process.env.DB_HOST}:${process.env.PORT}`,
  });
});

app.use("/users", UsersRoutes);

app.listen(PORT, () => {
  console.log(`server berhasil jalan di port ${PORT}`);
});

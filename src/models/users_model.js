const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ErrorResponse } = require("../config/error.js");
const { loginUserValidation } = require("../validations/UsersValidation.js");
const { validate } = require("../config/validate.js");
const db = require("../config/database.js");

const createAccessToken = (username) => {
  return jwt.sign(username, process.env.SECRET_KEY, {
    expiresIn: "1m",
  });
};
const createRefreshToken = (username) => {
  return jwt.sign({ username: username }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};
const verify_Token = async (access_token) => {
  try {
    const user = await jwt.verify(
      access_token,
      process.env.SECRET_KEY,
      (err, decoded) => {
        if (err) {
          let message = "";
          if (err.name == "JsonWebTokenError") {
            message = "Sesi tidak valid";
          } else if ((err.name = "TokenExpiredError")) {
            message = "Sesi anda berakhir, silahkan login kembali";
          }
          throw new ErrorResponse(401, message);
        } else {
          return decoded;
        }
      }
    );
    return user;
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};

const refresh_Token = async (refreshToken) => {
  if (refreshToken) {
    try {
      const token = await verify_Token(refreshToken);

      const [users] = await db.dbPool
        .promise()
        .query("SELECT * FROM users WHERE username = ?", [token.username]);
      if (users.length > 0) {
        const access_token = createAccessToken(users[0]);
        const user = await verify_Token(access_token);
        const expires_at = user.exp * 1000;
        const refresh_token = createRefreshToken(users[0].username);
        return { access_token, refresh_token, expires_at };
      } else {
        throw new ErrorResponse(400, "User tidak ditemukan");
      }
    } catch (error) {
      throw new ErrorResponse(error.status, error);
    }
  } else {
    throw new ErrorResponse(401, "Gagal refresh token, silahkan login kembali");
  }
};

const login = async (req) => {
  const input = validate(loginUserValidation, req); //validasi input
  try {
    const [users] = await db.dbPool
      .promise()
      .query("SELECT * FROM users WHERE username = ? ", [input.username]);
    if (users.length > 0) {
      var passwordIsValid = bcrypt.compareSync(
        input.password,
        users[0].password
      );
      if (!passwordIsValid) {
        throw new ErrorResponse(401, " Password Salah");
      } else {
        const access_token = createAccessToken(users[0]);
        const user = await verify_Token(access_token);
        const expires_at = user.exp * 1000;
        const refresh_token = createRefreshToken(users[0].username);

        return { access_token, refresh_token, expires_at };
      }
    } else {
      throw new ErrorResponse(401, "User tidak ditemukan");
    }
  } catch (error) {
    throw new ErrorResponse(error.status, error);
  }
};

const getAllUser = () => {
  const SQLQuery = "SELECT * FROM users";

  return db.execute(SQLQuery);
};
const addNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (username, name, email, password) VALUES ('${body.username}', '${body.name}', '${body.email}', '${body.password}')`;

  return db.execute(SQLQuery);
};
const updateUser = (body, idUser) => {
  const SQLQuery = `UPDATE users SET username='${body.username}', name='${body.name}', email='${body.email}', password='${body.password}' WHERE id_user=${idUser} `;

  return db.execute(SQLQuery);
};
const deleteUser = (idUser) => {
  const SQLQuery = `DELETE FROM users WHERE id_user=${idUser}`;

  return db.execute(SQLQuery);
};

module.exports = {
  verify_Token,
  refresh_Token,
  login,
  getAllUser,
  addNewUser,
  updateUser,
  deleteUser,
};

// import { responSuccess } from "../helpers/formatResponse.js";
const UsersModel = require("../models/users_model.js");

const loginUser = async (req, res, next) => {
  try {
    const { acces_token, refresh_token, expires_at } = await UsersModel.login(
      req.body
    );
    res.cookie("access_token", acces_token, { httpOnly: true });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 86400000, //24 jam
    });
    res.cookie("expires_at", expires_at, { httpOnly: true });
    res.status(200).json({
      status: true,
      code: res.statusCode,
      message: `Berhasil Login User`,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const [data] = await UsersModel.getAllUser();

    res.json({
      message: "GET ALL USERS Success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: " SERVER ERROR",
      serverMessage: error,
    });
  }
};

const AddNewUser = async (req, res) => {
  const { body } = req;
  try {
    await UsersModel.addNewUser(body);
    res.json({
      message: "ADD NEW USER Success",
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      message: " SERVER ERROR",
      serverMessage: error,
    });
  }
};

const UpdateUser = async (req, res) => {
  const { idUser } = req.params;
  const { body } = req;
  try {
    await UsersModel.updateUser(body, idUser);
    res.json({
      message: "UPDATE USER Success",
      data: {
        id: idUser,
        ...body,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      serverMessage: error,
    });
  }
};

const DeleteUser = async (req, res) => {
  const { idUser } = req.params;
  try {
    await UsersModel.deleteUser(idUser);
    res.json({
      message: "DELETE USER Success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      serverMessage: error,
    });
  }
};

module.exports = {
  loginUser,
  getAllUser,
  AddNewUser,
  UpdateUser,
  DeleteUser,
};

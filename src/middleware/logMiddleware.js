const logRequest = (req, res, next) => {
  console.log("Log Terjadi request ke PATH: ", req.path);
  next();
};

module.exports = logRequest;

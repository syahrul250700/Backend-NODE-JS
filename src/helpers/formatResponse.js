export const responSuccess = (res, results, message) => {
  res.status(200).json({
    code: res.statusCode,
    status: true,
    message: message,
    results: results,
  });
  res.send();
};

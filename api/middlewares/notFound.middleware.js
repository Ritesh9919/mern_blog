const notFoundMiddleware = (req, res) => {
  res.send("This route does not exist");
};

export default notFoundMiddleware;

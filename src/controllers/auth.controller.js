const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.json({message : "Logout Success"});
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

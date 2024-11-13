const prisma = require("../configs/prisma");
const { jwt } = require("../model");
const createError = require("../utils/createError");

exports.auth = async (req, res, next) => {
  try {
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return createError(401, "Unauthorized");
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.log("jwt verify error", err);
        return createError(401, "Unauthorized");
      }
      req.user = decode;
    });
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });
    if (!user.enable) {
      return createError(404, "Access denied");
    }
    next();
  } catch (err) {
    next(err);
  }
};

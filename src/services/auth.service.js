const prisma = require("../prisma/client");
const {generateAccessToken,} = require("../utils/jwt");
const {generateRefreshToken,} = require("../utils/jwt");
const {comparePassword,} = require("../utils/password");
const {hashPassword} = require("../utils/password")

exports.register = async ({ username, email, password }) =>  {
  // 1. validate input
  if((!username || !email || !password)) {
    throw {
        status : 404, 
        message : "Username or email or password are required!"
    }
  }
  // 2. check email / username exists
   const existsUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username},
      ],
    },
  });

  if (existsUser) {
    throw{
        status: 409, 
        message: "User already exists"
    }
  }
  // 3. hash password
  const hashedPassword = await hashPassword(password);
  // 4. create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
    },
  });

  // 5. return user

  return {
    data: payload,
    accessToken,
    refreshToken,
  };
};

exports.login = async ({ identifier, password }) => {
  if (!identifier || !password) {
    throw {
      status: 400,
      message: "Identifier and password are required",
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
      ],
    },
  });

  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw {
      status: 403,
      message: "Wrong password",
    };
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);

  return {
    data: payload,
    accessToken,
  };
};


exports.logout = async (user) => {
  // hapus semua refresh token user
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  return true;
};

exports.refreshToken = async (data) => {
  // 1. verify refresh token
  // 2. generate new access token
};

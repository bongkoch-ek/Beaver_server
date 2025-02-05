const { jwt, bcrypt } = require("../model");
const prisma = require("../configs/prisma");
const createError = require("../utils/createError");

exports.register = async (req, res, next) => {
  try {
    const { email, displayName, password, firstname, lastname } = req.body;

    if (!email) {
      return createError(400, "Email is required!!");
    }

    if (!password) {
      return createError(400, "Password is required!!");
    }

    // ตรวจสอบว่า email นั้นมีอยู่ในฐานข้อมูลหรือยัง
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // หากมีผู้ใช้ที่ใช้ email นี้อยู่แล้ว
    if (user) {
      return createError(400, "Email already exists");
    }

    // แฮช (hash) รหัสผ่านด้วย bcrypt
    const hashPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่าน

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    const createUser = await prisma.user.create({
      data: {
        email: email,
        displayName: displayName,
        password: hashPassword,
        fullname: `${firstname.trim()} ${lastname.trim()}`,
      },
    });

    res.send("Register Success");
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่า email มีอยู่ในฐานข้อมูลหรือไม่
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // หากไม่พบผู้ใช้งานที่ระบุ
    if (!user) {
      return createError(400, "User not found");
    }

    // ผู้ใช้ถูกปิดการใช้งาน (enabled: false)
    if (!user.enable) {
      return createError(404, "Access denied");
    }

    // ตรวจสอบความถูกต้องของรหัสผ่านที่ผู้ใช้กรอกมา
    const isMatch = await bcrypt.compare(password, user.password); // เปรียบเทียบรหัสผ่านที่กรอกกับที่เก็บในฐานข้อมูล
    if (!isMatch) {
      return createError(400, "Password Invalid!!");
    }

    // สร้างข้อมูล Payload สำหรับการสร้าง Token
    const payload = {
      id: user.id,
      email: user.email,
      displayname: user.displayName,
      fullname: user.fullname,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // สร้าง JWT Token โดยใช้ข้อมูล payload และ secret key ที่เก็บในไฟล์ .env
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // กำหนดอายุของ Token เป็น 30 วัน
      },
      (err, token) => {
        // callback function ที่จะถูกเรียกเมื่อสร้าง token เสร็จ
        if (err) {
          return createError(500, "Server Error");
        }

        res.json({ payload, token }); // ส่งข้อมูล payload และ token กลับไปยัง client
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.loginGoogle = async (req, res, next) => {
  try {
    const { email, name, picture , given_name } = req.body;
    console.log("check body from google :", req.body);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    let newUser = null;
    if (user) {
      newUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          email: email,
          displayName: given_name ,
          fullname: name,
          profileImage: picture,
        },
      });
    } else {
      newUser = await prisma.user.create({
        data: {
          email: email,
          displayName: name,
          fullname: name,
          profileImage: picture,
          password: "123456",
        },
      });
    }
    const payload = {
      id: newUser.id,
      email: newUser.email,
      fullname: newUser.fullname,
      profileImage: newUser.profileImage,
      displayname: newUser.displayName,
    };

    console.log("check payload :", payload);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          return createError(500, "Server Error");
        }
        res.json({ payload, token });
      }
    );
  } catch (err) {
    next(err);
  }
};


exports.currentUser = async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { 
            email: req.user.email,
        },select:{
            id: true,
            email: true,
            displayName: true,
            fullname: true,
            profileImage: true,
            bio: true,
            phone: true,
        }
      });
      if (!user) {
        return next(createError(404, "User not found"));
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
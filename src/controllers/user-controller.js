const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const fs = require("fs/promises");
const { cloudinary } = require("../model");
const path = require("path");

// Get a user by ID
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return next(createError(400, "Invalid user ID"));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// List all users
exports.listUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        displayName: true,
        email: true,
        fullname: true,
        profileImage: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { displayName, firstname, lastname, bio, phone } = req.body;
    const haveFile = Boolean(req.file);

    let uploadResult = {};
    if (haveFile) {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        overwrite: true,
        public_id: path.parse(req.file.path).name,
      });
      fs.unlink(req.file.path);
    }

    console.log("check body update :", req.body);
    const userId = req.user.id;

    const data = {
      displayName: displayName,
      fullname: `${firstname} ${lastname}`,
      bio: bio,
      phone: phone,
    };
    if (haveFile) {
      data.profileImage = uploadResult.secure_url;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: data,
    });
    console.log("check user update :", user);
    res.status(200).json({
      message: `Updated user ${user.displayName} successfully`,
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: +id },
    });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Create a project
exports.createProject = async (req, res, next) => {
  try {
    const { projectName, images } = req.body;
    const userId = req.user.id;
    console.log("Images received:", images);

    if (!userId) {
      return next(createError(403, "User not authenticated"));
    }

    console.log("check project name :", projectName);

    const project = await prisma.project.create({
      data: {
        projectName,
        userId,
        images: {
          create: images.map((image) => ({
            asset_id: image.asset_id,
            public_id: image.public_id,
            url: image.url,
            secure_url: image.secure_url,
          })),
        },
      },
    });

    await prisma.groupProject.create({
      data: {
        userId: userId,
        projectId: project.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    });

    const list = await prisma.list.createMany({
      data: [
        {
          title: "To do",
          projectId: project.id,
          userId: userId,
          status: "TODO",
        },
        {
          title: "In Progress",
          projectId: project.id,
          userId: userId,
          status: "INPROGRESS",
        },
        {
          title: "Done",
          projectId: project.id,
          userId: userId,
          status: "DONE",
        },
      ],
    });

    const userResponse = {
      id: userId,
      email: req.user.email,
    };

    res.status(201).json({
      message: `Created project ${project.projectName} successfully`,
      project: {
        id: project.id,
        projectName: project.projectName,
        user: userResponse,
        images: project.images,
      },
    });
  } catch (err) {
    console.error("Error creating project:", err);
    next(err);
  }
};

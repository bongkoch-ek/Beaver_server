const prisma = require("../configs/prisma");
const createError = require("../utils/createError");

// Get a user by ID
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: +id },
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
        select:{
            displayName:true,
            email:true,
            fullname:true,
            profileImage:true,
        }
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email , profileImage } = req.body; 
    const user = await prisma.user.update({
      where: { id: +id },
      data: { 
        displayName: name,
        email: email,
        profileImage: profileImage,
     },
    });
    res.status(200).json({message: `Updated user ${user.displayName} successfully`});
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
    const { projectName , userId } = req.body; 
    const project = await prisma.project.create({
      data: {
        projectName: projectName,
        user: { connect: { id: +userId } }, 
      },
    });
    res.status(201).json({message: `Created project ${project.projectName} successfully`});
  } catch (err) {
    next(err);
  }
};

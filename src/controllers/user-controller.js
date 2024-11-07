const prisma = require("../configs/prisma");
const createError = require("../utils/createError");

// Get a user by ID
exports.getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!id || isNaN(id)) {
        return next(createError(400, "Invalid user ID"));
      }
  
      const user = await prisma.user.findUnique({
        where: { 
          id: parseInt(id) 
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
    const { displayname, firstname, lastname, profileImage, bio, phone} =
      req.body;
      console.log("check body update :",req.body);
    const userId = req.user.id;
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        displayName: displayname,
        fullname: `${firstname} ${lastname}`,
        bio: bio,
        phone: phone,
        profileImage: profileImage,
      },
    });
    console.log("check user update :",user)
    res
      .status(200)
      .json({ message: `Updated user ${user.displayName} successfully`, user : user });
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
      const { projectName, images , asset_id , public_id , url , secure_url } = req.body; 
      const userId = req.user.id; 
      console.log("Images received:", images); 
  
      if (!userId) {
        return next(createError(403, "User not authenticated"));
      }
  
      console.log("check project name :", projectName); 
  
      const project = await prisma.project.create({
        data: {
          projectName: projectName,
          userId: userId,
          images: {
            create: {
              asset_id: asset_id,
              public_id: public_id,
              url: url,
              secure_url: secure_url,
            },
          }
        },
      });
  
      await prisma.groupProject.create({
        data: {
          userId: userId,
          projectId: project.id,
          role: "OWNER",
        },
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
  
const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const { cloudinary } = require("../model");

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// C
//#region Create
exports.createActivityLog = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;
    const activityLog = await prisma.activityLog.create({
      data: {
        project: { connect: { id: +projectId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(activityLog);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, listId } = req.body;
    const userId = req.user.id;

    if (!title || !listId) {
      return createError(400, "Title and List ID are required");
    }

    const task = await prisma.task.create({
      data: {
        user: { connect: { id: userId } },
        title,
        list: { connect: { id: listId } },
      },
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.createList = async (req, res, next) => {
  try {
    const { name, status, projectId } = req.body;
    const userId = req.user.id;
    console.log(req.body);

    if (!name || !projectId) {
      return createError(400, "Name and Project ID are required");
    }

    const list = await prisma.list.create({
      data: {
        title: name,
        projectId: projectId,
        userId: userId,
        status,
      },
    });

    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { comment, taskId } = req.body;
    const userId = req.user.id;

    if (!comment || !taskId) {
      return createError(400, "Content and Task ID are required");
    }

    const comments = await prisma.comment.create({
      data: {
        comment,
        task: { connect: { id: taskId } },
        user: { connect: { id: userId } },
      },
      include:{
        user : {
          select : {
            id : true,
            displayName : true
          }
        }
      }
    });

    res.status(201).json(comments);
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.body;

    console.log("check body", req.body);

    if (!projectId || !userId) {
      return next(createError(400, "Project ID and User ID are required"));
    }

    const project = await prisma.groupProject.findUnique({
      where: { id: +projectId },
    });

    if (!project) {
      return next(createError(404, "Project not found"));
    }

    await prisma.groupProject.update({
      where: { id: +projectId },
      data: {
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(200).json({ message: "Member added successfully" });
  } catch (err) {
    next(err);
  }
};

exports.createWebLink = async (req, res, next) => {
  try {
    const { taskId, url } = req.body;
    // const userId = req.user.id;
    const activityLog = await prisma.weblink.create({
      data: {
        taskId: +taskId,
        url
      },
    });
    res.status(201).json(activityLog);
  } catch (err) {
    next(err);
  }
};

//#endregion

// R
//#region  Reading
exports.getActivityLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const activityLog = await prisma.activityLog.findMany({
      distinct: ["projectId"],
      where: {
        userId: userId,
      },
      include: {
        project: {
          include: {
            list: {
              include: {
                task: true,
              },
            },
          },
        },
      },
      orderBy: {
        recentlyTime: "desc",
      },
    });

    // const distinctProjects = [...new Set(activityLog.map(log => log.project.id))];
    // const distinctProjects = [...new Set(activityLog)];

    // Return the activity log and distinct project IDs
    res.status(200).json({
      success: true,
      data: {
        activityLog,
        // distinctProjects,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: +id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
          },
        },
        assignee: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true
              }
            }
          }
        },
        list: true,
        comment: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
        webLink: true,
        images: true,

      },
    });
    if (!task) {
      return createError(404, "Task not found");
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getCommentByTaskId = async (req, res, next) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const comment = await prisma.comment.findMany({
      where: { taskId : +id },
      include: {
        user:{
          select:{
            id: true,
            displayName: true
          }
        }
      }
    });

    if (!comment) {
      return createError(404, "Comment not found");
    }

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

exports.getAllLists = async (req, res, next) => {
  try {
    const lists = await prisma.list.findMany({
      include: { tasks: true },
    });
    res.status(200).json(lists);
  } catch (err) {
    next(err);
  }
};

exports.getListById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!list) {
      return createError(404, "List not found");
    }

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        list: {
          include: {
            task: {
              include: {
                images: true,
              }
            }
          },
        },
        user: true,
        groupProject: {
          include : {
            user : true
          }
        },
        images: true,
      }
    });
    if (!project) {
      return createError(404, "Project not found");
    }
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { list: true },
    });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projects = await prisma.groupProject.findMany({
      where: { userId: userId },
      include: {
        project: true,
        user: {
          select: {
            email: true,
            displayName: true,
            fullname: true,
          },
        },
      },
    });
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getTodayTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = tomorrow.toISOString().split("T")[0];
    const task = await prisma.task.findMany({
      where: {
        userId,
        dueDate: {
          lte: new Date(tomorrow),
          gte: new Date(today),
        },
      },
      include: {
        list: {
          include: {
            project: {
              select: {
                projectName: true,
              },
            },
          },
          // select: {
          //   title: true,

          // }
        },
      },
    });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        fullname: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

//#endregion

// U
//#region update
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, dueDate, priority, listId } =
      req.body;

    await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        startDate,
        dueDate,
        priority,
        list: listId ? { connect: { id: listId } } : undefined,
      },
    });

    const task = await prisma.task.findUnique({
      where: { id: +id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true
          }
        },
        assignee: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true
              }
            }
          }
        },
        list: true,
        comment: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true
              }
            }
          }
        },
        webLink: true
      }
    });

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { projectName, images } = req.body;

    if (isNaN(id)) return next(createError(400, "Invalid project ID"));

    const updateData = { projectName };

    if (images && images.length > 0) {
      updateData.images = {
        upsert: images
          .filter((image) => image.id)
          .map((image) => ({
            where: { id: image.id },
            update: {
              asset_id: image.asset_id,
              public_id: image.public_id,
              url: image.url,
              secure_url: image.secure_url,
            },
            create: {
              asset_id: image.asset_id,
              public_id: image.public_id,
              url: image.url,
              secure_url: image.secure_url,
            },
          })),
        create: images
          .filter((image) => !image.id)
          .map((image) => ({
            asset_id: image.asset_id,
            public_id: image.public_id,
            url: image.url,
            secure_url: image.secure_url,
          })),
      };
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (err) {
    next(err);
  }
};


exports.updateStatusMember = async (req, res, next) => {
  try {
    const { id } = +req.params.id;
    // const { status } = req.body;
    const member = await prisma.groupProject.update({
      where: { id },
      data: {
        status: "ACTIVE",
      },
    });
    res.status(200).json(member);
  } catch (err) {
    next(err);
  }
};
//#endregion

// D
//#region Delete
exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.list.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = +req.params;
    await prisma.groupProject.delete({
      where: { id },
    });
    await prisma.project.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return next(createError(400, "Project ID and User ID are required"));
    }

    await prisma.groupProject.update({
      where: { id: projectId },
      data: {
        user: {
          disconnect: { id: userId },
        },
      },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteWebLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.weblink.delete({
      where: { id: +id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

//#endregion

//#region  images section
exports.uploadImages = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `Beaver-${Date.now()}`,
      resource_type: "auto",
      folder: "Beaver",
    });
    res.send(result);
  } catch (err) {
    next(err);
  }
};

exports.removeImages = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove image succesfull");
    });
  } catch (err) {
    next(err);
  }
};
//#endregion

//#region search section
const handleQuery = async (req, res, query) => {
  try {
    const lowerCaseQuery = query.toLowerCase();
    const member = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: lowerCaseQuery,
            },
          },
          {
            displayName: {
              contains: lowerCaseQuery,
            },
          },
          {
            fullname: {
              contains: lowerCaseQuery,
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        fullname: true,
      },
    });
    res.send(member);
  } catch (err) {
    console.error("Error in handleQuery:", err);
    res.status(500).send({ error: "An error occurred while searching for members." });
  }
};

exports.searchFilters = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (query) {
      console.log("query :", query);
      await handleQuery(req, res, query);
    }
  } catch (err) {
    next(err);
  }
};
//#endregion

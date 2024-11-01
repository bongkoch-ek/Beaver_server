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

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, listId, priority } = req.body;

    if (!title || !listId) {
      return createError(400, "Title and List ID are required");
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
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
    const { name, projectId } = req.body;
    const userId = req.user.id;

    if (!name || !projectId) {
      return createError(400, "Name and Project ID are required");
    }

    const list = await prisma.list.create({
      data: {
        name,
        project: { connect: { id: projectId } },
        creator: { connect: { id: userId } },
      },
    });

    res.status(201).json(list);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { content, taskId } = req.body;
    const userId = req.user.id;

    if (!content || !taskId) {
      return createError(400, "Content and Task ID are required");
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        task: { connect: { id: taskId } },
        creator: { connect: { id: userId } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return next(createError(400, "Project ID and User ID are required"));
    }

    const project = await prisma.groupProject.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return createError(404, "Project not found");
    }

    await prisma.groupProject.update({
      where: { id: projectId },
      data: {
        members: { connect: { id: userId } },
      },
    });

    res.status(200).json({ message: "Member added successfully" });
  } catch (err) {
    next(err);
  }
};

// R

exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      return createError(404, "Task not found");
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

exports.getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id },
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
    const { id } = req.params;
    const project = await prisma.groupProject.findUnique({
      where: { id },
      include: { members: true },
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
    const projects = await prisma.groupProject.findMany({
      include: {
        list: {
          include: { tasks: true },
        },
      },
    });
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

// U

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, listId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate,
        priority,
        list: listId ? { connect: { id: listId } } : undefined,
      },
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
      where: { id },
      data: req.body,
    });

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await prisma.groupProject.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

// D

exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.list.delete({
      where: { id },
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
      where: { id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.groupProject.delete({
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
        members: {
          disconnect: { id: userId },
        },
      },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// images section
exports.uploadImages = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `Beaver-${Date.now()}`,
      resource_type: "auto",
      folder: "Beaver",
    });
    res.send(result)
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

  // search section
  const handleQuery = async (req, res, query) => {
    try {
      const member = await prisma.user.findMany({
        where: {
          email: {
            contains: query,
          },
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          fullname: true,
        }
        
      });
      res.send(member);
    } catch (err) {
      next(err);
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
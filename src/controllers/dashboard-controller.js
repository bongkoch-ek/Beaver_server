const prisma = require("../configs/prisma");
const createError = require("../utils/createError");

//// C

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, listId } = req.body;

    if (!title || !listId) {
      return createError(400, "Title and List ID are required");
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        list: {
          connect: { id: listId },
        },
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

    if (!name || !projectId) {
      return createError(400, "Name and Project ID are required");
    }

    const list = await prisma.list.create({
      data: {
        name,
        project: {
          connect: { id: projectId },
        },
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

    if (!content || !taskId) {
      return createError(400, "Content and Task ID are required");
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        task: {
          connect: { id: taskId },
        },
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
      return createError(400, "Project ID and User ID are required");
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
        members: {
          connect: { id: userId },
        },
      },
    });

    res.status(200).json({ message: "Member added successfully" });
  } catch (err) {
    next(err);
  }
};

//// R

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
      include: {
        members: true,
      },
    });
    if (!project) {
      return createError(404, "Project not found");
    }
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

exports.gettAllTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
        include:{
            list: true
        }
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
          include: {
            task: true,
          },
        },
      },
    });
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

//// U

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id },
      data: req.body,
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

//// D

exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.list.delete({
      where: { id },
    });
    res.status(204).json({ message: "Deleted list successfully" });
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
    res.status(204).json({ message: "Deleted task successfully" });
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
    res.status(204).json({ message: "Deleted Project successfully" });
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
    res.status(204).json({ message: "Deleted comment successfully" });
  } catch (err) {
    next(err);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await prisma.groupProject.update({
      where: { id: project.projectId },
      data: {
        members: {
          disconnect: { id },
        },
      },
    });
    res.status(204).json({ message: "Deleted member successfully" });
  } catch (err) {
    next(err);
  }
};

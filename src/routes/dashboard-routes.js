const { express } = require("../model");
const router = express.Router();
const {assignUserToTask,getProjectMembers,getImageTask,createTaskImages,getAllUser,getActivityLog,createComment,createList,createTask,addMember,getAllComments,getAllLists,getAllProjects,getAllTasks,getCommentByTaskId,getListById,getTaskById,getProjectById,updateList,updateProject,updateTask,deleteComment,deleteList,deleteMember,deleteProject,deleteTask,searchFilters, createActivityLog, getTodayTask,updateStatusMember,createWebLink,deleteWebLink, deleteImageTask} = require("../controllers");

/// C

router.post("/create-task",createTask)
router.post("/create-list",createList)
router.post("/create-comment",createComment)  // create comment
router.post("/add-member",addMember) // add member to project
router.post("/search",searchFilters) // use this api for search
router.post("/create-activitylog",createActivityLog) // create activity log
router.post("/create-weblink", createWebLink) // create activity log
router.post('/assign-user', assignUserToTask); // assign user to task
router.post("/create-imagetask", createTaskImages)


/// R 

router.get("/comment",getAllComments)  // get list all comment
router.get("/project",getAllProjects)  // get all project -> include list -> include task ****
router.get("/list",getAllLists)  // get all list 
router.get("/task",getAllTasks)  // get all task 
router.get("/comment/:id",getCommentByTaskId)  // get comment by id
router.get("/list/:id",getListById)  // get list by id
router.get("/task/:id",getTaskById)  // get task by id
router.get("/project/:id",getProjectById)  // get project by id
router.get("/activitylog",getActivityLog) // get activity log
router.get("/today-task",getTodayTask) // get activity log
router.get("/getuser",getAllUser)
router.get("/get-member/:id",getProjectMembers)
router.get("/getimages", getImageTask)


/// U

router.patch("/task/:id",updateTask)  // edit task
router.patch("/list/:id",updateList)  // edit list
router.patch("/project/:id",updateProject)  // edit project 
router.patch("/status-member/:id",updateStatusMember)  // edit status member

/// D

router.delete("/list/:id",deleteList)  
router.delete("/task/:id",deleteTask)
router.delete("/project/:id",deleteProject)
router.delete("/comment/:id",deleteComment)  
router.delete("/member",deleteMember)  // delete member by body parameter
router.delete("/weblink/:id",deleteWebLink)






module.exports = router
const { express } = require("../model");
const router = express.Router();
const {createComment,createList,createTask,addMember,getAllComments,getAllLists,getAllProjects,getAllTasks,getCommentById,getListById,getTaskById,getProjectById,updateList,updateProject,updateTask,deleteComment,deleteList,deleteMember,deleteProject,deleteTask,uploadImages,removeImages,searchFilters} = require("../controllers")
const {auth} =require("../middlewares")

/// C

router.post("/create-task",createTask)
router.post("/create-list",createList)
router.post("/create-comment",createComment)  // create comment
router.post("/add-member",addMember) // add member to project
router.post("/search",searchFilters) // use this api for search


/// R 

router.get("/comment",getAllComments)  // get list all comment
router.get("/project",getAllProjects)  // get all project -> include list -> include task ****
router.get("/list",getAllLists)  // get all list 
router.get("/task",getAllTasks)  // get all task 
router.get("/comment/:id",getCommentById)  // get comment by id
router.get("/list/:id",getListById)  // get list by id
router.get("/task/:id",getTaskById)  // get task by id
router.get("/project/:id",getProjectById)  // get project by id


/// U

router.patch("/task/:id",updateTask)  // edit task
router.patch("/list/:id",updateList)  // edit list
router.patch("/project/:id",updateProject)  // edit proje
/// D

router.delete("/list/:id",deleteList)  
router.delete("/task/:id",deleteTask)
router.delete("/project/:id",deleteProject)
router.delete("/comment/:id",deleteComment)
router.delete("/member",deleteMember)  // delete member by body parameter


// image upload 
router.post("/images",uploadImages)  // use this api for upload images
router.post("/removeimages",removeImages)  // use this api for remove images


module.exports = router;
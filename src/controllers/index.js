const {register,login,loginGoogle} = require('./auth-controller')
const {getUser,listUser,updateProfile,deleteUser, createProject} = require('./user-controller')
const {createComment,createList,createTask,addMember,getAllComments,getAllProjects,getAllLists,gettAllTasks,getCommentById,getListById,getTaskById,getProjectById,updateList,updateProject,updateTask,deleteComment,deleteList,deleteMember,deleteProject,deleteTask} = require("./dashboard-controller")

module.exports = {
    register,
    login,
    loginGoogle,
    getUser,
    listUser,
    updateProfile,
    deleteUser,
    createProject,
    createComment,
    createList,
    createTask,
    addMember,
    getAllComments,
    getAllProjects,
    getAllLists,
    gettAllTasks,
    getCommentById,
    getListById,
    getTaskById,
    getProjectById,
    updateList,
    updateProject,
    updateTask,
    deleteComment,
    deleteList,
    deleteMember,
    deleteProject,
    deleteTask
}
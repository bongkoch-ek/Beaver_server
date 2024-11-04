const { express } = require("../model");
const router = express.Router();
const {getUser,listUser,createProject,updateProfile,deleteUser} = require("../controllers")
const {auth} = require("../middlewares")

/// C
router.post("/create-project", createProject); // create project

/// R
router.get("/:id", getUser); // get user by id
router.get("/listuser", listUser); // get all user

/// U
router.patch("/update-profile", updateProfile); // update user profile

/// D
router.delete("/:id", deleteUser); //  delete user

module.exports = router;

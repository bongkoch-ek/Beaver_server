const { express } = require("../model");
const router = express.Router();
const {
  getUser,
  listUser,
  createProject,
  updateProfile,
  deleteUser,
} = require("../controllers");
const { auth } = require("../middlewares");
const upload = require("../middlewares/upload");

/// C
router.post("/create-project", auth, createProject); // create project

/// R
router.get("/:id", getUser); // get user by id
router.get("/listuser", listUser); // get all user

/// U
router.patch("/update-profile", auth, upload.single("profileImage"), updateProfile); // update user profile

/// D
router.delete("/:id", auth, deleteUser); //  delete user

module.exports = router;

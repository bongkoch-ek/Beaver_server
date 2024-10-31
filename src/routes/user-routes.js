const { express } = require("../model");
const router = express.Router();

/// C
router.post("/create-project", () => {}); // create project

/// R
router.get("/:id", () => {}); // get user by id
router.get("/listuser", () => {}); // get all user

/// U
router.patch("/:id", () => {}); // update user profile

/// D
router.delete("/:id", () => {}); //  delete user

module.exports = router;

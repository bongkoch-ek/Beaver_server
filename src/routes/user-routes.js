const { express } = require("../model");
const router = express.Router();

/// C
router.post("/create-project", () => {});

/// R
router.get("/getuser", () => {}); // get user by id
router.get("/listuser", () => {}); // get all user

/// U
router.patch("/update-profile", () => {});

/// D
router.delete("/delete-user", () => {});

module.exports = router;

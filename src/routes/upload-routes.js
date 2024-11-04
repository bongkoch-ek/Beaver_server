const { express } = require("../model");
const router = express.Router();
const {uploadImages,removeImages} = require("../controllers")


// image upload 
router.post("/images",uploadImages)  // use this api for upload images
router.post("/removeimages",removeImages)  // use this api for remove images


module.exports = router;
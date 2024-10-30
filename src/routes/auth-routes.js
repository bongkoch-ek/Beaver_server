const { express } = require("../model")
const router = express.Router();
const {register,login} = require('../controllers');






router.post('/register', register)
router.post('/login', login)


module.exports =  router
const { express } = require("../model")
const router = express.Router();
const {register,login,loginGoogle} = require('../controllers');






router.post('/register', register)
router.post('/login', login)
router.post('/login-google', loginGoogle)


module.exports =  router
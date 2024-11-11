const { express } = require("../model")
const router = express.Router();
const {register,login,loginGoogle,currentUser} = require('../controllers');
const { registerValidator, loginValidator , auth } = require('../middlewares');



router.post('/register',registerValidator, register)
router.post('/login',loginValidator, login)
router.post('/login-google', loginGoogle)
router.post('/current-user', auth ,currentUser)


module.exports =  router
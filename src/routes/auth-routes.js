const { express } = require("../model")
const router = express.Router();
const {register,login,loginGoogle} = require('../controllers');
const  { registerValidator, loginValidator } = require('../middlewares');





router.post('/register',registerValidator, register)
router.post('/login',loginValidator, login)
router.post('/login-google', loginGoogle)


module.exports =  router
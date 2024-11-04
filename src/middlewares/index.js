const notFound = require("./not-found")
const handleError = require("./handleError")
const { registerValidator , loginValidator } = require('./validate');
const {auth} = require("./authenticate")



module.exports = {
    notFound,
    handleError,
    registerValidator,
    loginValidator,
    auth
}
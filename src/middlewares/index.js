const notFound = require("./not-found")
const handleError = require("./handleError")
const { registerValidator , loginValidator } = require('./validate');




module.exports = {
    notFound,
    handleError,
    registerValidator,
    loginValidator,
}
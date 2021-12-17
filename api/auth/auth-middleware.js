const User = require('../users/users-model')

async function checkUsernameFree(req, res, next) {
    try{
      const user = await User.findByUsername(req.body.username)
      if(!user){
        next()
      }else{
        next({status: 422, message: "username taken"})
      }
    }catch(err){
      next(err)
    }
  }

async function checkUsernameExists(req, res, next) {
    try{
        const user = await User.findByUsername(req.body.username)
        if(!user) {
          next({ status: 401, message: "invalid credentials"})
        }else{
          req.user = user
          next()
        }
      }catch(err){
       next(err)
      }
}

module.exports ={
    checkUsernameExists,
    checkUsernameFree
}
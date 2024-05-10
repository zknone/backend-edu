exports.findUserById = function (results, id, cb) {
    process.nextTick(function () {
      const idx = id - 1
      if (results[idx]) {
        cb(null, results[idx])
      } else {
        cb(new Error('User ' + id + ' does not exist'))
      }
    })
  }
  
  exports.findByUsername = function (results, username, cb) {
    process.nextTick(function () {
      let i = 0, len = results.length
      for (; i < len; i++) {
        const record = results[i]
        if (record.username === username) {
          return cb(null, record)
        }
      }
      return cb(null, null)
    })
  }
  
  exports.verifyPassword = (user, password) => {
    return user.password === password
  }


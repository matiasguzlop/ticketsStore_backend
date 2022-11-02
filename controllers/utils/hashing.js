const bcrypt = require('bcrypt');

const hashPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (saltError, salt) => {
    if (saltError) {
      reject(saltError);
    } else {
      bcrypt.hash(password, salt, (hashError, hash) => {
        if (hashError) {
          reject(hashError);
        }
        resolve(hash);
      });
    }
  });
});

const verifyPassword = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (error, isMatch) => {
    if (error) {
      reject(error);
    }
    if (isMatch) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
});

module.exports = {
  verifyPassword,
  hashPassword,
};

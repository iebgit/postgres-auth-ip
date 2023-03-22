const { connection } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.storeUser = async (user, res) => {
  bcrypt.hash(user.password, 12).then(async (hashed_password) => {
    try {
      await connection("users")
        .where({ username: user.username })
        .first()
        .then(async (retrievedUser) => {
          if (!retrievedUser) {
            res.json({
              status: "credentials added",
              user: user.username,
            });
            await connection("users").insert({
              username: user.username,
              hashed_password: hashed_password,
              email: user.email,
            });
          } else
            res.json({
              status: "duplicate username",
            });
        });
    } catch (e) {
      console.log(e);
    }
  });
};

exports.loginUser = async (user, res) => {
  try {
    await connection("users")
      .where({ username: user.username, email: user.email })
      .first()
      .then((retrievedUser) => {
        try {
          if (!retrievedUser) res.json({ status: "user not found" });
          Promise.all([
            bcrypt.compare(user.password, retrievedUser.hashed_password),
            Promise.resolve(retrievedUser),
          ]).then((results) => {
            try {
              const areSamePasswords = results[0];
              if (!areSamePasswords)
                res.json({ status: "invalid login credientials" });
              const user = results[1];
              const payload = { username: user.username };
              const secret = "SECRET";
              jwt.sign(payload, secret, (error, token) => {
                if (error) res.json({ status: "sign-in error" });
                res.json({ token, user: user.username });
              });
            } catch (error) {
              res.json({ status: error });
            }
          });
        } catch (e) {
          console.log(e);
        }
      });
  } catch (error) {
    res.json({ status: error });
  }
};

exports.get20LatestUsers = async () =>
  await connection("users").orderBy("created_at", "desc");

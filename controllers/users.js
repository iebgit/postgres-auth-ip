const jwt = require("jsonwebtoken");
const { storeUser, loginUser } = require("../services/users");

exports.addUser = async (req, res) => {
  await storeUser(req.body, res);
};

exports.admitUser = async (req, res) => {
  await loginUser(req.query, res);
};

exports.authenticate = (request, response, next) => {
  const authHeader = request.get("Authorization");
  const token = authHeader.split(" ")[1];
  const secret = "SECRET";
  jwt.verify(token, secret, (error, payload) => {
    if (error) throw new Error("sign in error!");
    database("users")
      .where({ username: payload.username, email: payload.email })
      .first()
      .then((user) => {
        request.user = user;
        next();
      })
      .catch((error) => {
        response.json({ message: error.message });
      });
  });
};

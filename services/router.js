const router = require("express").Router();
const {
  lookupIPAddresses,
  validateIPAddress,
} = require("../controllers/ipTools");
const { getLast20Queries } = require("../controllers/history");
const {
  getLast20Users,
  addUser,
  admitUser,
  authenticate,
} = require("../controllers/users");

router.route("/tools/lookup").get(lookupIPAddresses);
router.route("/tools/validate").post(validateIPAddress);
router.route("/history").get(getLast20Queries);
router.route("/users").post(addUser);
router.route("/login", authenticate).get(admitUser);

module.exports = router;

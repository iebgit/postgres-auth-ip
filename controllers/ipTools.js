const dns = require("dns");
const requestIp = require("request-ip");
const { storeQuery } = require("../services/queries");

exports.lookupIPAddresses = async function (req, res, next) {
  const { domain } = req.query;

  dns.resolve4(domain, async (err, addresses) => {
    if (err) {
      console.error(`Error resolving ${domain}:`, err);
      return res.status(400).send(err.message);
    }
    const queryObject = {
      addresses: addresses.map((address) => {
        return { ip: address };
      }),
      client_ip: requestIp.getClientIp(req),
      created_at: Date.now(),
      domain,
    };
    await storeQuery(queryObject);
    res.json(queryObject);
  });
};

exports.validateIPAddress = function (req, res, next) {
  const { ip } = req.body;
  const chunks = ip.split(".");
  if (chunks.length !== 4) {
    return res.status(400).send({ message: "Bad Request" });
  }

  for (let i = 0; i < 4; ++i) {
    if (!/^\d+$/.test(chunks[i]) || chunks[i] < 0 || chunks[i] > 255) {
      return res.json({ status: false });
    }
  }

  res.json({ status: true });
};

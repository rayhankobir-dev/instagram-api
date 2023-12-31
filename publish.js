const { IgApiClient } = require("instagram-private-api");
const fs = require("fs");

const postToInsta = async (data) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    await ig.publish.photo({
      file: data,
    });

    return true;
  } catch (err) {
    return false;
  }
};

module.exports = postToInsta;

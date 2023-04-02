const Jimp = require("jimp");
const fs = require("fs");

const resizeAvatar = async (tmpPath) => {
  if (!fs.existsSync(tmpPath)) {
    throw new Error(`Invalid file path: ${tmpPath}`);
  }

  await Jimp.read(tmpPath)
    .then((image) => {
      return image.resize(250, 250).write(tmpPath);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  resizeAvatar,
};

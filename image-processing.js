
const sharp = require('sharp');
const fs = require('fs');

const dir = 'src/images/cropped';
const filePrefix = 'pathway-cropped';
const sizes = [
  {size : 3000},
  {size : 2500},
  {size : 2000},
  {size : 1000},
  {size : 500 }
];

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const pipeline = sharp('src/images/2281710-3k-high.jpg')
  .extract({ width: 3000, height: 470, left: 0, top: 780  });

function processImages(img) {
  try {
    // convert jpegs
    pipeline.clone().resize({ width: img.size })
      .jpeg({
        quality: 80,
      })
      .timeout({ seconds: 5 })
      .toFile(`${dir}/${filePrefix}-${img.size}.jpeg`);
    // convert webps
    pipeline.clone().resize({ width: img.size })
      .webp({
        quality: 80,
      })
      .timeout({ seconds: 5 })
      .toFile(`${dir}/${filePrefix}-${img.size}.webp`);
  } catch (error) {
    console.log(error);
  }
}

sizes.map(processImages);


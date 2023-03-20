const { writeFile, appendFile } = require('fs/promises');
const { exec } = require('child_process');
const Vec = require('./vec.js')

async function main() {
  const nx = 200;
  const ny = 100;

  const a = new Vec.vec3(1,2,3);

  writeFile('out.ppm', `P3\n${nx} ${ny}\n255\n`)

  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      const r = i / nx;
      const g = j / ny;
      const b = 0.2;

      const ir = Math.floor(255.99 * r);
      const ig = Math.floor(255.99 * g);
      const ib = Math.floor(255.99 * b);

      appendFile('out.ppm', `${ir} ${ig} ${ib}\n`)
    }
  }
}

main().then(() => {
  return exec('mogrify -format png out.ppm')
}).then(() => {
  return exec('feh --zoom 400 out.png')
}).then(() => {
  console.log('ok')
})

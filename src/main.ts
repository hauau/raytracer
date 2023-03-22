import { writeFile, appendFile, rm } from 'fs/promises';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
import Vec, { vec3 } from './vec'
import { ray } from './ray';
import { Hitable, HitRecord } from './hitable';
import { HitableList } from './hitable-list';
import { Sphere } from './sphere';
import { Camera } from './camera';

function randomInUnitSphere(): vec3 {
  let contactPoint: vec3;

  do {
    contactPoint = Vec.scaleMul(
      Vec.sub(
        new vec3(Math.random(), Math.random(), Math.random()),
        new vec3(1,1,1)
      ),
      2.0
    )
  } while (contactPoint.squaredLength >= 1)

  return contactPoint;
}

function color(someray: ray, world: Hitable) {
  const rec = {} as HitRecord;

  if (world.hit(someray, 0.0, Number.MAX_VALUE, rec)) {
    const target = Vec.add(
      rec.p,
      Vec.add(
        rec.normal,
        randomInUnitSphere()
      )
    )
    
    return Vec.scaleMul(
      new Vec.vec3(rec.normal.x + 1, rec.normal.y + 1, rec.normal.z + 1),
      0.5
    )
  }

  const unitDirection = Vec.unitVector(someray.direction);
  const t = 0.5 * (unitDirection.y + 1.0);

  return Vec.add( 
    Vec.scaleMul(new Vec.vec3(1,1,1)    , 1.0 - t),
    Vec.scaleMul(new Vec.vec3(0.5,0.7,1), t)
  )
}

async function main() {
  const nx = 200;
  const ny = 100;
  const ns = 100;

  const lowerLeftCorner = new Vec.vec3(-2.0, -1.0, -1.0)
  const horizontal =      new Vec.vec3(4, 0, 0)
  const vertical =        new Vec.vec3(0, 2, 0);
  const origin =          new Vec.vec3(0, 0, 0);

  const world = new HitableList(
    new Sphere(new Vec.vec3(0, 0,      -1), 0.5),
    new Sphere(new Vec.vec3(0.6, -0.3, -1), 0.6),
  )

  const camera = new Camera(
    lowerLeftCorner,
    horizontal,
    vertical,
    origin,
  );

  try {
    await rm('/tmp/out.ppm')
    await rm('/tmp/out.png')
  } catch {}

  await writeFile('/tmp/out.ppm', `P3\n${nx} ${ny}\n255\n`)

  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      let col = new vec3(0, 0, 0);

      for (let s = 0; s < ns; s++) {
        const u = (i + Math.random()) / nx;
        const v = (j + Math.random()) / ny;

        const r = camera.getRay(u, v);
        const p = r.pointAtParameter(2.0);

        col = Vec.add(
            col, 
            color(r, world)
          )
      }

      col = Vec.scaleDiv(col, ns)

      const ir = Math.floor(255.99 * col.r);
      const ig = Math.floor(255.99 * col.g);
      const ib = Math.floor(255.99 * col.b);

      await appendFile('/tmp/out.ppm', `${ir} ${ig} ${ib}\n`)
    }
  }

  await exec('mogrify -format png /tmp/out.ppm')
  await exec('feh --zoom 400 /tmp/out.png') 
}

main().then(() => {
  console.log('ok')
}).catch(console.error);

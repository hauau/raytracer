import { writeFile, appendFile, rm, copyFile } from 'fs/promises';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
import Vec, { vec3 } from './vec'
import { ray } from './ray';
import { Hitable, HitRecord } from './hitable';
import { HitableList } from './hitable-list';
import { randomInUnitSphere, Sphere } from './sphere';
import { Camera } from './camera';
import { Dielectric, Lambertian, Metal } from './material';

function color(someray: ray, world: HitableList, depth: number): vec3 {
  const rec = {} as HitRecord;

  if (world.hit(someray, 0.001, Number.MAX_VALUE, rec)) {
    const scatterRes = {
      scatteredRay: new ray(new vec3(0,0,0), new vec3(0,0,0)),
      attenuation: new vec3(0,0,0)
    }

    const isScattering = rec.material.scatter(
      someray,
      rec,
      scatterRes
    )

    if (depth < 50 && isScattering) {
      return Vec.mul(
        scatterRes.attenuation,
        color(scatterRes.scatteredRay, world, depth + 1)
      );
    } else {
      return new vec3(0, 0, 0);
    }
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

  const camera = new Camera(
    90,
    nx/ny
  );
  const R = Math.cos(Math.PI / 4);

  const world = new HitableList(
    new Sphere(
      new Vec.vec3(0, 0,      -1), 0.5,
      new Lambertian(new vec3(0.1, 0.2, 0.5))),
    new Sphere(
      new Vec.vec3(0, -100.5, -1), 100,
      new Lambertian(new vec3(0.8, 0.8, 0.0))
    ),
    new Sphere(
      new Vec.vec3(1, 0, -1), 0.5,
      new Metal(new vec3(0.8, 0.6, 0.2), 0.3)
    ),
    new Sphere(
      new Vec.vec3(-1, 0,      -1), 0.5,
      new Dielectric(1.5)
    ),
    new Sphere(
      new Vec.vec3(-1, 0,      -1), -0.45,
      new Dielectric(1.5)
    ),
  )

  try {
    await rm('/tmp/out.ppm')
    await rm('/tmp/out.png')
  } catch {}

  await writeFile('/tmp/out.ppm', `P3\n${nx} ${ny}\n255\n`)

  console.time('Rendering')
  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      let col = new vec3(0, 0, 0);

      for (let s = 0; s < ns; s++) {
        const u = (i + Math.random()) / nx;
        const v = (j + Math.random()) / ny;

        const r = camera.getRay(u, v);

        col = Vec.add(
            col, 
            color(r, world, 0)
          )
      }

      col = Vec.scaleDiv(col, ns)

      // gamma 2
      col = new vec3(
        Math.sqrt(col.r),
        Math.sqrt(col.g),
        Math.sqrt(col.b)
      )

      const ir = Math.floor(255.99 * col.r);
      const ig = Math.floor(255.99 * col.g);
      const ib = Math.floor(255.99 * col.b);

      await appendFile('/tmp/out.ppm', `${ir} ${ig} ${ib}\n`)
    }
  }

  console.timeEnd('Rendering')


  await exec('mogrify -format png /tmp/out.ppm')
  await copyFile('/tmp/out.png', `./renders/out_${+new Date()}.png`)
  await exec('viewnior /tmp/out.png') 
}

main().catch(console.error);

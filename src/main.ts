import { writeFile, appendFile, rm } from 'fs/promises';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);
import Vec, { vec3 } from './vec'
import { ray } from './ray';

function hitSphere(vecCenter: vec3, radius: number, vray: ray) {
  const originCenterVec = Vec.sub(vray.origin, vecCenter);

  const a = Vec.dot(vray.direction, vray.direction);
  const b = 2.0 * Vec.dot(originCenterVec, vray.direction);
  const c = Vec.dot(originCenterVec, originCenterVec) - radius * radius;
  const discriminant = b*b - 4*a*c;

  if (discriminant < 0) {
    return -1.0;
  } else {
    return (-b - Math.sqrt(discriminant)) / (2.0 * a)
  }
}

function color(someray: ray) {
  const sphere = new Vec.vec3(0,0,-1);
  const sphereRadius = 0.5;
  const sphereHitpointT = hitSphere(sphere, sphereRadius, someray);

  if (sphereHitpointT > 0) {
    const Normal = Vec.unitVector(
      Vec.sub(
        someray.pointAtParameter(sphereHitpointT),
        new Vec.vec3(0, 0, -1)
      )
    );


    return Vec.scaleMul(new Vec.vec3(Normal.x + 1, Normal.y + 1, Normal.z + 1), 0.5)
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

  const lowerLeftCorner = new Vec.vec3(-2.0, -1.0, -1.0)
  const horizontal =      new Vec.vec3(4, 0, 0)
  const vertical =        new Vec.vec3(0, 2, 0);
  const origin =          new Vec.vec3(0, 0, 0);

  try {
    await rm('/tmp/out.ppm')
    await rm('/tmp/out.png')
  } catch {}

  await writeFile('/tmp/out.ppm', `P3\n${nx} ${ny}\n255\n`)

  for (let j = ny - 1; j >= 0; j--) {
    for (let i = 0; i < nx; i++) {
      const u = i / nx;
      const v = j / ny;

      const r = new ray(
        origin,
        Vec.add(
          lowerLeftCorner,
          Vec.add(
            Vec.scaleMul(horizontal, u),
            Vec.scaleMul(vertical,   v)
          )
        )
      )

      const col = color(r);

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

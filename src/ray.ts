import Vec, { vec3 } from './vec'

let meow = 0;

export class ray {
  A: vec3;
  B: vec3;

  constructor(veca: vec3, vecb: vec3) {
    meow++;
    this.A = veca;
    this.B = vecb;
  }

  get origin() {
    return this.A;
  }

  get direction() {
    return this.B;
  }

  pointAtParameter(t: number) {
    return Vec.add(this.origin, Vec.scaleMul(this.direction, t))
  }

}

//do something when app is closing
process.on('exit', () => {
  console.log(`Rays: ${meow.toLocaleString()}`)
});

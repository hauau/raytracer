export class vec3 {
  e0: number;
  e1: number;
  e2: number;

  e3?: number;

  constructor(e0: number, e1: number, e2: number) {
    this.e0 = e0;
    this.e1 = e1;
    this.e2 = e2;
  }

  get x() {
    return this.e0;
  }

  get y() {
    return this.e1;
  }

  get z() {
    return this.e2;
  }

  get r() {
    return this.e0;
  }

  get g() {
    return this.e1;
  }

  get b() {
    return this.e2;
  }

  get length() {
    return Math.sqrt(this.squaredLength)
  }

  get squaredLength() {
      return this.e0 **2 + this.e1 **2 + this.e2 **2;
  }   

  makeUnitVector() {
    const k = 1.0 / this.length;
    this.e0 *= k;
    this.e1 *= k;
    this.e2 *= k;
  }
}

function getInverse(veca: vec3): vec3 {
  return new vec3(
    -veca.x,
    -veca.y,
    -veca.z
  )
}

function unitVector(vec: vec3) {
  return scaleDiv(vec, vec.length)
}

function scaleDiv(veca: vec3, factor: number) {
  return new vec3(
    veca.x / factor,
    veca.y / factor,
    veca.z / factor
   )
}

function scaleMul(veca: vec3, factor: number) {
  return new vec3(
    veca.x * factor,
    veca.y * factor,
    veca.z * factor
   )
}

function mul(veca: vec3, vecb: vec3) {
  return new vec3(
    veca.x * vecb.x,
    veca.y * vecb.y,
    veca.z * vecb.z
   )
}

function div(veca: vec3, vecb: vec3) {
  return new vec3(
    veca.x / vecb.x,
    veca.y / vecb.y,
    veca.z / vecb.z
   )
}

function add(veca: vec3, vecb: vec3) {
  return new vec3(
         veca.x + vecb.x,
         veca.y + vecb.y,
         veca.z + vecb.z
        )
}

function sub(veca: vec3, vecb: vec3) {
  return new vec3(
         veca.x - vecb.x,
         veca.y - vecb.y,
         veca.z - vecb.z
        )
}

function dot(veca: vec3, vecb: vec3) {
  return veca.x * vecb.x + 
         veca.y * vecb.y + 
         veca.z * vecb.z 
}

function cross(veca: vec3, vecb: vec3) {
  const x = veca.y * vecb.z - veca.z * vecb.y;
  const y = veca.z * vecb.x - veca.x * vecb.z;
  const z = veca.x * vecb.y - veca.y * vecb.x;

  return new vec3(x, y, z);
}

function reflect(incomingRay: vec3, n: vec3): vec3 {
  // in - 2 * dot(in, n) * n;
  return sub(
      incomingRay,
      scaleMul(
        scaleMul(
          n,
          dot(
            incomingRay,
            n
          )
        ),
        2
      )
    );
} 

function refract(v: vec3, n: vec3, niOverNt: number): vec3 | undefined {
  const uv = unitVector(v);
  const dt = dot(uv, n);
  const discriminant = 1 - (niOverNt**2) * (1 - dt**2);

  if (discriminant > 0) {
    return sub(
      scaleMul(
        sub(
          uv,
          scaleMul(
            n,
            dt
          )
        ),
        niOverNt
      ),
      scaleMul(
        n,
        Math.sqrt(discriminant)
      )
    );
  }
}

export default {
  vec3,
  reflect,
  dot,
  cross,
  add,
  sub,
  div,
  scaleDiv,
  scaleMul,
  unitVector,
  mul,
  getInverse,
  refract
}

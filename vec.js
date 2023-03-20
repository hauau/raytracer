class vec3 {
  e0;
  e1;
  e2;

  e3;

  constructor(e0, e1, e2) {
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
      this.e0 * this.e0 +
      this.e1 * this.e1 +
      this.e2 * this.e2
  }   

  makeUnitVector() {
    const k = 1.0 / this.length;
    this.e0 *= k;
    this.e1 *= k;
    this.e2 *= k;
  }

}

function unitVector(vec) {
  return scaleDiv(vec, vec.length)
}

function scaleDiv(veca, factor) {
  return new vec3(
    veca.x / factor,
    veca.y / factor,
    veca.z / factor
   )
}

function scaleMul(veca, factor) {
  return new vec3(
    veca.x * factor,
    veca.y * factor,
    veca.z * factor
   )
}

function mul(veca, vecb) {
  return new vec3(
    veca.x * vecb.x,
    veca.y * vecb.y,
    veca.z * vecb.z
   )
}

function div(veca, vecb) {
  return new vec3(
    veca.x / vecb.x,
    veca.y / vecb.y,
    veca.z / vecb.z
   )
}

function add(veca, vecb) {
  return new vec3(
         veca.x + vecb.x,
         veca.y + vecb.y,
         veca.z + vecb.z
        )
}

function sub(veca, vecb) {
  return new vec3(
         veca.x - vecb.x,
         veca.y - vecb.y,
         veca.z - vecb.z
        )
}

function dot(veca, vecb) {
  return veca.x * vecb.x + 
         veca.y * vecb.y + 
         veca.z * vecb.z 
}

function cross(veca, vecb) {
  const x = veca.y * vecb.z - veca.z * vecb.y;
  const y = veca.z * vecb.x - veca.x * vecb.z;
  const z = veca.x * vecb.y - veca.y * vecb.x;

  return new vec3(x, y, z);
}

module.exports = {
  vec3,
  dot,
  cross,
  add,
  sub,
  div,
  scaleDiv,
  scaleMul,
  unitVector
}

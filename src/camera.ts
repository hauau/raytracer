import { ray } from "./ray";
import Vec, { vec3 } from "./vec";

export class Camera {
  origin: vec3;
  lowerLeftCorner: vec3;
  horizontal: vec3;
  vertical: vec3;

  /**
   * 
   lowerLeftCorner: vec3  = new vec3(-2.0, -1.0, -1.0),
    horizontal: vec3       = new vec3(4,  0,  0),
    vertical: vec3         = new vec3(0,  2,  0),
    origin: vec3           = new vec3(0,  0,  0),
   */
  constructor(
    vfov: number,
    aspect: number
  ) {
    const theta = vfov * Math.PI / 180;
    const halfHeight = Math.tan(theta / 2);
    const halfWidth = aspect * halfHeight;
    this.origin = new vec3(0, 0, 0);
    this.lowerLeftCorner = new vec3(-halfWidth, -halfHeight, -1);
    this.horizontal = new vec3(2*halfWidth, 0, 0);
    this.vertical = new vec3(0, 2*halfHeight, 0);
  }

  getRay(u: number, v: number): ray {
    // ray(origin, lowerLeftCorner + u*hor + v * vertical - origin)
    return new ray(
      this.origin,
      Vec.add(
        this.lowerLeftCorner,
        Vec.add(
          Vec.scaleMul(this.horizontal, u),
          Vec.sub(
            Vec.scaleMul(this.vertical, v),
            this.origin
          )
        )

      )
    )
  }
}
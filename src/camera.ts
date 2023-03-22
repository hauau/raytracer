import { ray } from "./ray";
import Vec, { vec3 } from "./vec";

export class Camera {
  origin: vec3;
  lowerLeftCorner: vec3;
  horizontal: vec3;
  vertical: vec3;

  constructor(
    lowerLeftCorner: vec3  = new vec3(-2.0, -1.0, -1.0),
    horizontal: vec3       = new vec3(4,  0,  0),
    vertical: vec3         = new vec3(0,  2,  0),
    origin: vec3           = new vec3(0,  0,  0),
  ) {
    this.origin = origin;
    this.lowerLeftCorner = lowerLeftCorner;
    this.horizontal = horizontal;
    this.vertical = vertical;
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
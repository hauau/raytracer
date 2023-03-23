import { Hitable, HitRecord } from "./hitable";
import { Material } from "./material";
import { ray } from "./ray";
import Vec, { vec3 } from "./vec";

export class Sphere implements Hitable {
  center: vec3;
  radius: number;
  material: Material;

  constructor(center: vec3, radius: number, material: Material) {
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  hit(ray: ray, t_min: number, t_max: number, hitRecord: HitRecord) {
    const originCenterVec = Vec.sub(ray.origin, this.center);

    const a = Vec.dot(ray.direction, ray.direction);
    const b = Vec.dot(originCenterVec, ray.direction);
    const c = Vec.dot(originCenterVec, originCenterVec) - this.radius ** 2;
    const discriminant = b**2 - a*c;
  
    if (discriminant > 0) {
      let temp = (-b - Math.sqrt(discriminant)) / a;

      if (temp < t_max && temp > t_min) {
        hitRecord.t = temp;
        hitRecord.p = ray.pointAtParameter(hitRecord.t);
        hitRecord.normal = Vec.scaleDiv(
          Vec.sub(hitRecord.p, this.center), 
          this.radius
        )

        return true;
      }

      temp = (-b + Math.sqrt(discriminant)) / a;

      if (temp < t_max && temp > t_min) {
        hitRecord.t = temp;
        hitRecord.p = ray.pointAtParameter(hitRecord.t);
        hitRecord.normal = Vec.scaleDiv(
          Vec.sub(hitRecord.p, this.center), 
          this.radius
        )

        return true;
      }
    }

    return false;
  }
}

export function randomInUnitSphere(): vec3 {
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

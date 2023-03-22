import { Hitable, HitRecord } from "./hitable";
import { ray } from "./ray";
import Vec, { vec3 } from "./vec";

export class Sphere implements Hitable {
  center: vec3;
  radius: number;

  constructor(center: vec3, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  hit(ray: ray, t_min: number, t_max: number, hitRecord: HitRecord) {
    const originCenterVec = Vec.sub(ray.origin, this.center);

    const a = Vec.dot(ray.direction, ray.direction);
    const b = Vec.dot(originCenterVec, ray.direction);
    const c = Vec.dot(originCenterVec, originCenterVec) - this.radius * this.radius;
    const discriminant = b*b - a*c;
  
    if (discriminant > 0) {
      let temp = (-b - Math.sqrt(discriminant)) / (a);

      if (temp < t_max && temp > t_min) {
        hitRecord.t = temp;
        hitRecord.p = ray.pointAtParameter(hitRecord.t);
        hitRecord.normal = Vec.scaleDiv(
          Vec.sub(hitRecord.p, this.center), 
          this.radius
        )

        return true;
      }

      temp = (-b + Math.sqrt(discriminant)) / (a);

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
import { ray } from "./ray";
import { vec3 } from "./vec";

export interface HitRecord {
  t: number;
  p: vec3;
  normal: vec3;
}

export abstract class Hitable {
  abstract hit(ray: ray, t_min: number, t_max: number, hitRecord: HitRecord): boolean
}

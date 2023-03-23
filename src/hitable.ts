import { Material } from "./material";
import { ray } from "./ray";
import { vec3 } from "./vec";

export interface HitRecord {
  t: number;
  p: vec3;
  normal: vec3;
  material: Material;
}

export abstract class Hitable {
  abstract material: Material;
  abstract hit(ray: ray, t_min: number, t_max: number, hitRecord: HitRecord): boolean
}

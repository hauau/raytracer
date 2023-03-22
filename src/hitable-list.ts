import { Hitable, HitRecord } from "./hitable";
import { ray } from "./ray";
import { vec3 } from "./vec";

export class HitableList extends Array<Hitable> implements Hitable {
  hit(ray: ray, t_min: number, t_max: number, hitRecord: HitRecord) {
    const tempHitRecord: HitRecord = { 
      t: 0, 
      p: new vec3(0,0,0), 
      normal: new vec3(0,0,0)
    };

    let anyHits = false;
    let closestSoFar = t_max;

    for (const hitable of this) {
      if (hitable.hit(ray, t_min, closestSoFar, tempHitRecord)) {
        anyHits = true;
        closestSoFar = tempHitRecord.t 
        Object.assign(hitRecord, tempHitRecord);
      }
    }

    return anyHits;
  }
}

import { HitRecord } from "./hitable";
import { ray } from "./ray";
import { randomInUnitSphere } from "./sphere";
import Vec, { vec3 } from "./vec";

interface scatterResult {
  attenuation: vec3;
  scatteredRay: ray;
}

export abstract class Material {
  abstract scatter(incomingRay: ray, rec: HitRecord, res: scatterResult): boolean;
}

/** Diffuse */
export class Lambertian implements Material {
  albedo: vec3;
  constructor(albdeo: vec3) {
    this.albedo = albdeo;
  }

  scatter(_: ray, rec: HitRecord, res: scatterResult): boolean {
    const target = Vec.add(
      rec.p,
      Vec.add(
        rec.normal,
        randomInUnitSphere()
      )
    );

    res.scatteredRay = new ray(rec.p, Vec.sub(target, rec.p));

    res.attenuation = this.albedo;
    return true;
  }
}

export class Metal implements Material {
  albedo: vec3;
  
  constructor(albdeo: vec3) {
    this.albedo = albdeo;
  }

  scatter(incomingRay: ray, rec: HitRecord, res: scatterResult): boolean {
    const reflected = Vec.reflect(
      Vec.unitVector(incomingRay.direction),
      rec.normal
    );

    res.scatteredRay = new ray(rec.p, reflected);
    res.attenuation = this.albedo;

    return Vec.dot(res.scatteredRay.direction, rec.normal) > 0;
  }
}

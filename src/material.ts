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
  constructor(albedo: vec3) {
    this.albedo = albedo;
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
  fuzziness: number;

  constructor(albdeo: vec3, fuzziness: number) {
    this.albedo = albdeo;
    this.fuzziness = fuzziness < 1 ? fuzziness : 1;
  }

  scatter(incomingRay: ray, rec: HitRecord, res: scatterResult): boolean {
    const reflected = Vec.reflect(
      Vec.unitVector(incomingRay.direction),
      rec.normal
    );

    res.scatteredRay = new ray(
      rec.p,
      Vec.add(
        reflected,
        Vec.scaleMul(
          randomInUnitSphere(),
          this.fuzziness
        )
      )
    );
    res.attenuation = this.albedo;

    return Vec.dot(res.scatteredRay.direction, rec.normal) > 0;
  }
}

export class Dielectric implements Material {
  refractionIndex: number;

  constructor(refractionIndex: number) {
    this.refractionIndex = refractionIndex;
  }

  scatter(incomingRay: ray, rec: HitRecord, res: scatterResult): boolean {
    let outwardNormal: vec3;
    let niOverNt: number;
    let reflectProbability: number;
    let cosine: number;
    let reflected = Vec.reflect(incomingRay.direction, rec.normal);

    res.attenuation = new vec3(1,1,1);

    if (Vec.dot(incomingRay.direction, rec.normal) > 0) {
      outwardNormal = Vec.getInverse(rec.normal);
      niOverNt = this.refractionIndex;
      cosine = this.refractionIndex * Vec.dot(incomingRay.direction, rec.normal) / incomingRay.direction.length;
    } else {
      outwardNormal = rec.normal
      niOverNt = 1 / this.refractionIndex;
      cosine = -Vec.dot(incomingRay.direction, rec.normal) / incomingRay.direction.length;
    }

    const refractedRay = Vec.refract(incomingRay.direction, outwardNormal, niOverNt);

    reflectProbability = refractedRay 
      ? schlick(cosine, this.refractionIndex) 
      : 1;

    if (Math.random() < reflectProbability) {
      res.scatteredRay = new ray(rec.p, reflected);
    } else {
      res.scatteredRay = new ray(rec.p, refractedRay!);
    }
    
    return true;
  }
}

export function schlick(cosine: number, refractionIndex: number) {
  const r0 = ((1 - refractionIndex) / (1 + refractionIndex)) ** 2;
  return r0 + (1 - r0) * (1 - cosine) ** 5;
}

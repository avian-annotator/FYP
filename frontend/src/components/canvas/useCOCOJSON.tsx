// This file contains a hook to create a COCO JSON object and export it. It should be moved into a separate folder in future!
type cocoInfo = {
  year: string // in format YYYY
  version: string
  description: string
  contributor: string
  url: string
  date_created: string // iso 8601 date format
}

type cocoCategory = {
  id: number
  name: string
  supercategory: string
}

type cocoImage = {
  id: number
  license: number
  file_name: string
  height: number
  width: number
  date_captured: string //iso 8601 date format
}

type cocoAnnotation = {
  id: number
  image_id: number
  category_id: number
  bbox: number[] // length = 4
  area: number
  segmentation: number[][] // array of numbers(length=2)
  iscrowd: number
}

type cocoLicense = {
  id: number
  url: string
  name: string
}

class CocoJsonObj {
  constructor(
    public info: cocoInfo,
    public licenses: cocoLicense[],
    public categories: cocoCategory[],
    public images: cocoImage[],
    public annotations: cocoAnnotation[],
  ) {}

  public export = (): string => {
    return JSON.stringify({
      info: this.info,
      licenses: this.licenses,
      categories: this.categories,
      images: this.images,
      annotations: this.annotations,
    })
  }
}

export type { cocoInfo, cocoLicense, cocoCategory, cocoImage, cocoAnnotation }
export default CocoJsonObj

import CanvasState from "./CanvasState"

const VERSION = "1,0"
const DESCRIPTION = "Exported from Avian Annotator"
const CONTRIBUTOR = "Allen, Anthony, Daniel, Sacha"
const URL = "https://github.com/avian-annotator/FYP"

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
  keypoints: string[]
  skeleton: number[][]
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
  file_name: string
  category_id: number
  bbox: number[] // length = 4
  area: number
  segmentation: number[][] // array of numbers(length=2)
  iscrowd: number
  keypoints: number[]
  num_keypoints: number
}

type cocoLicense = {
  id: number
  url: string
  name: string
}

class CocoJsonObj implements CanvasExporter {
  export_type = "COCOJSON" as canvasExportTypes
  
  public static fromState(state: CanvasState): CanvasExporter {
    //TODO: add logic to convert from state or workspace data? to COCOJSON
      return new CocoJsonObj(
        {
          year: new Date().getFullYear().toString(),
          version: VERSION,
          description: DESCRIPTION,
          contributor: CONTRIBUTOR,
          url: URL,
          date_created: new Date().toISOString(),
        },
        [], // licenses
        [], // categories
        [], // images
        [], // annotations
      )
  }

  constructor(
    public info: cocoInfo,
    public licenses: cocoLicense[],
    public categories: cocoCategory[],
    public images: cocoImage[],
    public annotations: cocoAnnotation[],
  ) {}

  public fromState(state: CanvasState): CanvasExporter {
      return CocoJsonObj.fromState(state)
  }

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

type canvasExportTypes = "COCOJSON" // | "YOLOTXT" | "PascalVOCXML"

interface CanvasExporter {
  export_type: canvasExportTypes;
  export():string;
  fromState(state:CanvasState):CanvasExporter;
}

function CanvasExport(state: CanvasState, export_type: canvasExportTypes): string {
  switch (export_type){
    case "COCOJSON":
      return CocoJsonObj.fromState(state).export()     
  }
}

export type { cocoInfo, cocoLicense, cocoCategory, cocoImage, cocoAnnotation }
export default CanvasExport

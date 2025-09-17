import CanvasState from "./CanvasState"
import CocoJsonObj from "./Objects/CocoJson"

const VERSION = "1,0"
const DESCRIPTION = "Exported from Avian Annotator"
const CONTRIBUTOR = "Allen, Anthony, Daniel, Sacha"
const URL = "https://github.com/avian-annotator/FYP"
const SUPERCATEGORY = "birds"

type canvasExportTypes = "COCOJSON" // | "YOLOTXT" | "PascalVOCXML"

const stateToCoco = (state: CanvasState):string => JSON.stringify(
  new CocoJsonObj(
    {
      year: new Date().getFullYear().toString(),
      version: VERSION,
      description: DESCRIPTION,
      contributor: CONTRIBUTOR,
      url: URL,
      date_created: new Date().toISOString()
    },
    undefined,
    state.canvasElements.map((el, idx)=>({
      id: idx,
      name: el.props.label ?? "",
      supercategory: SUPERCATEGORY,
      keypoints: [],
      skeleton: [],
    })),
    [{
      id: 0,
      license: 0,
      file_name: "test.jpg",
      height: 0,
      width: 0,
      date_captured: new Date().toISOString()
    }],
    state.canvasElements.map((el, idx)=>{
      switch (el.type) {
        case "BoundingBox":
          return {
            id: el.props.id,
            image_id: 0,
            category_id: idx,
            bbox: [el.props.ref.current!.x(), el.props.ref.current!.y(), 
              el.props.ref.current!.width(), el.props.ref.current!.height()],
            area: el.props.ref.current!.width() * el.props.ref.current!.height(),
            iscrowd: 0
          }
        case "Keypoint":
          return {
            id: el.props.id,
            image_id: 0,
            category_id: idx,
            bbox: [el.props.ref.current!.x(), el.props.ref.current!.y(), 
              el.props.ref.current!.width(), el.props.ref.current!.height()],
            area: el.props.ref.current!.width() * el.props.ref.current!.height(),
            iscrowd: 0,
            keypoints: [], //TODO: fill in
            num_keypoints: 0
          }
        default:
          throw TypeError
      }}
    )
  )
)

function CanvasExport(state: CanvasState, export_type: canvasExportTypes): string {
  switch (export_type){
    case "COCOJSON":
      return stateToCoco(state)   
  }
}

export default CanvasExport

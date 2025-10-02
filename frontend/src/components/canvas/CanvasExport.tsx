/* eslint-disable */
import CanvasState from './CanvasState'
import CocoJsonObj from './Objects/CocoJson'
const VERSION = '1,0'
const DESCRIPTION = 'Exported from Avian Annotator'
const CONTRIBUTOR = 'Allen, Anthony, Daniel, Sacha'
const URL = 'https://github.com/avian-annotator/FYP'
const SUPERCATEGORY = 'birds'

type canvasExportTypes = 'COCOJSON' // | "YOLOTXT" | "PascalVOCXML"

function getKeypointAnnotation(state: CanvasState): {
  keypoints: number[]
  lines: [number, number][]
  keypointLabels: string[]
} {
  const keypointElements = state.canvasElements.toArray().filter(el => el.type === 'circle')
  const lineElements = state.canvasElements.toArray().filter(el => el.type === 'line')

  const keypoints: number[] = []
  const keypointLabels: string[] = []

  keypointElements.forEach(el => {
    keypointLabels.push(el.props.label ?? String(el.props.id)) //either label or id if not labelled
    keypoints.push(el.props.x(), el.props.y(), 2) // 2 is visible, all keypoints are visible automatically
  })

  const lines: [number, number][] = lineElements.map(line => {
    return [line.props.startId, line.props.endId]
  })

  return {
    keypoints,
    lines,
    keypointLabels,
  }
}

const stateToCoco = (state: CanvasState): string => {
  const { keypoints, lines, keypointLabels } = getKeypointAnnotation(state)

  const bboxAnnotations = state.canvasElements
    .toArray()
    .filter(el => el.type === 'rectangle')
    .map(el => {
      return {
        id: el.props.id,
        image_id: 0,
        category_id: 1,
        bbox: [
          el.props.x ?? 0,
          el.props.y() ?? 0,
          el.props.width ?? 0,
          el.props.ref.height ?? 0,
        ] as [number, number, number, number],
        area: (el.props.width() ?? 0) * (el.props.height() ?? 0),
        iscrowd: 0 as const,
      }
    })

  const keypointAnnotation = {
    id: bboxAnnotations.length + 1,
    image_id: 0,
    category_id: 1,
    bbox: [
      Math.min(...keypoints.filter((_, i) => i % 3 === 0)), //bounding box and area for keypoints just means the smallest possible area that encompasses all keypoints
      Math.min(...keypoints.filter((_, i) => i % 3 === 1)),
      Math.max(...keypoints.filter((_, i) => i % 3 === 0)) -
        Math.min(...keypoints.filter((_, i) => i % 3 === 0)),
      Math.max(...keypoints.filter((_, i) => i % 3 === 1)) -
        Math.min(...keypoints.filter((_, i) => i % 3 === 1)),
    ] as [number, number, number, number],
    area:
      (Math.max(...keypoints.filter((_, i) => i % 3 === 0)) -
        Math.min(...keypoints.filter((_, i) => i % 3 === 0))) *
      (Math.max(...keypoints.filter((_, i) => i % 3 === 1)) -
        Math.min(...keypoints.filter((_, i) => i % 3 === 1))),
    keypoints: keypoints,
    num_keypoints: keypointLabels.length,
    iscrowd: 0 as const,
  }

  return JSON.stringify(
    new CocoJsonObj(
      {
        year: new Date().getFullYear().toString(),
        version: VERSION,
        description: DESCRIPTION,
        contributor: CONTRIBUTOR,
        url: URL,
        date_created: new Date().toISOString(),
      },
      undefined,
      [
        {
          id: 0,
          name: 'bird', //because its all birds can all be same category i think but double check me on that
          supercategory: SUPERCATEGORY,
          keypoints: keypointLabels,
          skeleton: lines,
        },
      ],
      [
        {
          id: 0,
          license: 0,
          file_name: 'test.jpg',
          height: 0,
          width: 0,
          date_captured: new Date().toISOString(),
        },
      ],
      [...bboxAnnotations, keypointAnnotation],
    ),
  )
}

function CanvasExport(state: CanvasState, export_type: canvasExportTypes): string {
  switch (export_type) {
    case 'COCOJSON':
      return stateToCoco(state)
  }
}

export default CanvasExport

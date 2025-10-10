/* eslint-disable */
import * as Y from 'yjs'
import CanvasState, { createCanvasState } from './CanvasState'
import CocoJsonObj from './Objects/CocoJson'

const VERSION = '1,0'
const DESCRIPTION = 'Exported from Avian Annotator'
const CONTRIBUTOR = ''
const URL = 'https://github.com/avian-annotator/FYP'
const SUPERCATEGORY = 'birds'

type canvasExportTypes = 'COCOJSON'

function getKeypointAnnotation(state: CanvasState) {
  const keypointElements = state.canvasElements.toArray().filter(el => el.type === 'circle')

  const keypoints: number[] = []
  const keypointLabels: string[] = []
  const keypointIdMap = new Map<string, number>()

  keypointElements.forEach((el, index) => {
    const id = el.id!
    keypointLabels.push(el.label ?? id)
    keypoints.push(el.props.x ?? 0, el.props.y ?? 0, 2) // visibility fixed at 2
    keypointIdMap.set(id, index + 1) // COCO keypoint IDs are 1-based
  })

  const lineElements = state.canvasElements.toArray().filter(el => el.type === 'line')

  const lines: [number, number][] = lineElements
    .map(line => {
      const startId = keypointIdMap.get(line.startId!)
      const endId = keypointIdMap.get(line.endId!)
      if (startId && endId) {
        return [startId, endId]
      }
      return null
    })
    .filter(Boolean) as [number, number][]

  return {
    keypoints,
    lines,
    keypointLabels,
    keypointIdMap,
  }
}

function getOrCreateCategoryId(label: string, categoryMap: Map<string, number>): number {
  if (!categoryMap.has(label)) {
    categoryMap.set(label, categoryMap.size + 1)
  }
  return categoryMap.get(label)!
}

function stateToAnnotations(
  state: CanvasState,
  imageId: number,
  annotationStartId: number,
  categoryMap: Map<string, number>,
) {
  const { keypoints, lines, keypointLabels } = getKeypointAnnotation(state)

  const bboxAnnotations = state.canvasElements
    .toArray()
    .filter(el => el.type === 'rectangle')
    .map(el => {
      const label = el.label ?? 'bird'
      const categoryId = getOrCreateCategoryId(label, categoryMap)
      return {
        id: annotationStartId++,
        image_id: imageId,
        category_id: categoryId,
        bbox: [el.props.x ?? 0, el.props.y ?? 0, el.props.width ?? 0, el.props.height ?? 0] as [
          number,
          number,
          number,
          number,
        ],
        area: (el.props.width ?? 0) * (el.props.height ?? 0),
        iscrowd: 0 as const,
      }
    })

  let keypointAnnotation = null

  if (keypoints.length > 0) {
    const xs = keypoints.filter((_, i) => i % 3 === 0)
    const ys = keypoints.filter((_, i) => i % 3 === 1)

    // guard against NaN
    const minX = Math.min(...xs)
    const minY = Math.min(...ys)
    const maxX = Math.max(...xs)
    const maxY = Math.max(...ys)

    if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
      const bbox: [number, number, number, number] = [minX, minY, maxX - minX, maxY - minY]

      keypointAnnotation = {
        id: annotationStartId++,
        image_id: imageId,
        category_id: getOrCreateCategoryId('bird', categoryMap),
        bbox,
        area: bbox[2] * bbox[3],
        keypoints,
        num_keypoints: keypointLabels.length,
        iscrowd: 0 as const,
        keypoint_labels: keypointLabels, //COCOjson modification
        skeleton: lines,
      }
    }
  }

  return {
    annotations: keypointAnnotation ? [...bboxAnnotations, keypointAnnotation] : bboxAnnotations,
    keypointLabels,
    skeleton: lines,
  }
}

function CanvasExport(
  imageAnnotations: {
    imageId: number
    update: Uint8Array
    fileName: string
  }[],
  export_type: canvasExportTypes,
): string {
  if (export_type !== 'COCOJSON') {
    throw new Error('Unsupported export type')
  }

  const annotations: any[] = []
  const images: any[] = []
  let annotationId = 1
  const allKeypointLabels: string[][] = []
  const allSkeletons: [number, number][][] = []
  const categoryMap = new Map<string, number>()

  for (const { imageId, update, fileName } of imageAnnotations) {
    const doc = new Y.Doc()
    try {
      Y.applyUpdate(doc, update)
    } catch (e) {
      console.warn(`Skipping image ${imageId} — failed to apply Yjs update`, e)
      continue
    }
    const state = createCanvasState(doc)
    const result = stateToAnnotations(state, imageId, annotationId, categoryMap)

    annotationId += result.annotations.length
    annotations.push(...result.annotations)
    allKeypointLabels.push(result.keypointLabels)
    allSkeletons.push(result.skeleton)

    images.push({
      id: imageId,
      license: 0,
      file_name: fileName,
      date_captured: new Date().toISOString(),
    })
  }

  const categories = Array.from(categoryMap.entries()).map(([name, id]) => ({
    id,
    name,
    supercategory: SUPERCATEGORY,
  }))

  const cocoJson = new CocoJsonObj(
    {
      year: new Date().getFullYear().toString(),
      version: VERSION,
      description: DESCRIPTION,
      contributor: CONTRIBUTOR,
      url: URL,
      date_created: new Date().toISOString(),
    },
    undefined,
    categories,
    images,
    annotations,
  )

  return JSON.stringify(cocoJson)
}

export default CanvasExport

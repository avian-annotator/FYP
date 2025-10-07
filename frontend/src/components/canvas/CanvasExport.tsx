/* eslint-disable */
import * as Y from 'yjs'
import CanvasState, { createCanvasState } from './CanvasState'
import CocoJsonObj from './Objects/CocoJson'

const VERSION = '1,0'
const DESCRIPTION = 'Exported from Avian Annotator'
const CONTRIBUTOR = 'Allen, Anthony, Daniel, Sacha'
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

function stateToAnnotations(state: CanvasState, imageId: number, annotationStartId: number) {
  const { keypoints, lines, keypointLabels } = getKeypointAnnotation(state)

  const bboxAnnotations = state.canvasElements
    .toArray()
    .filter(el => el.type === 'rectangle')
    .map(el => ({
      id: annotationStartId++,
      image_id: imageId,
      category_id: 1,
      bbox: [el.props.x ?? 0, el.props.y ?? 0, el.props.width ?? 0, el.props.height ?? 0] as [
        number,
        number,
        number,
        number,
      ],
      area: (el.props.width ?? 0) * (el.props.height ?? 0),
      iscrowd: 0 as const,
    }))

  const keypointAnnotation = {
    id: annotationStartId++,
    image_id: imageId,
    category_id: 1,
    bbox: [
      Math.min(...keypoints.filter((_, i) => i % 3 === 0)),
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

  return {
    annotations: [...bboxAnnotations, keypointAnnotation],
    keypointLabels,
    skeleton: lines,
  }
}

function mergeKeypointsAndSkeletons(
  allKeypointLabels: string[][],
  allSkeletons: [number, number][][],
) {
  const labelToId = new Map<string, number>()
  const keypointLabels: string[] = []
  const mergedSkeleton: [number, number][] = []

  // Merge keypoint labels uniquely and assign new IDs
  allKeypointLabels.forEach(labels => {
    labels.forEach(label => {
      if (!labelToId.has(label)) {
        labelToId.set(label, keypointLabels.length + 1) // COCO IDs start at 1
        keypointLabels.push(label)
      }
    })
  })

  // Remap skeleton connections to new IDs
  allSkeletons.forEach((skeleton, idx) => {
    const labels = allKeypointLabels[idx]
    skeleton.forEach(([startId, endId]) => {
      const startLabel = labels[startId - 1]
      const endLabel = labels[endId - 1]
      mergedSkeleton.push([labelToId.get(startLabel)!, labelToId.get(endLabel)!])
    })
  })

  return { keypointLabels, skeleton: mergedSkeleton }
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

  for (const { imageId, update, fileName } of imageAnnotations) {
    const doc = new Y.Doc()
    Y.applyUpdate(doc, update)

    const state = createCanvasState(doc)
    const result = stateToAnnotations(state, imageId, annotationId)

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

  const { keypointLabels, skeleton } = mergeKeypointsAndSkeletons(allKeypointLabels, allSkeletons)

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
    [
      {
        id: 1,
        name: 'bird',
        supercategory: SUPERCATEGORY,
        keypoints: keypointLabels,
        skeleton,
      },
    ],
    images,
    annotations,
  )

  return JSON.stringify(cocoJson)
}

export default CanvasExport

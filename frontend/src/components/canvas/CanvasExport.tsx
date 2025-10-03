/* eslint-disable */
import CanvasState from './CanvasState'
import CocoJsonObj from './Objects/CocoJson'
const VERSION = '1,0'
const DESCRIPTION = 'Exported from Avian Annotator'
const CONTRIBUTOR = 'Allen, Anthony, Daniel, Sacha'
const URL = 'https://github.com/avian-annotator/FYP'
const SUPERCATEGORY = 'birds'

type canvasExportTypes = 'COCOJSON' // | "YOLOTXT" | "PascalVOCXML"

function getKeypointAnnotation(
  state: CanvasState,
) {
  const keypointElements = state.canvasElements
    .toArray()
    .filter(el => el.type === "circle");
  const lineElements = state.canvasElements
    .toArray()
    .filter(el => el.type === "line");

  const keypoints: number[] = [];
  const keypointLabels: string[] = [];
  const keypointIdMap = new Map<string, number>();

  keypointElements.forEach((el, index) => {
    const id = el.id!; 
    keypointLabels.push(el.label ?? id);
    keypoints.push(el.props.x ?? 0, el.props.y ?? 0, 2);
    keypointIdMap.set(id, index + 1);
  });
  console.log(lineElements)
  const lines: [number, number][] = lineElements.map(line => [
    keypointIdMap.get(line.startId!) ?? 0,
    keypointIdMap.get(line.endId!) ?? 0
  ]);

  return {
    keypoints,
    lines,
    keypointLabels
  };
}


const stateToCoco = (state: CanvasState): string => {
  const allIds = state.canvasElements
    .toArray()
    .map(el => el.id)
    .filter(id => id !== undefined);

  const uniqueIds = Array.from(new Set(allIds));
  const idMap = new Map<string | number, number>();
  uniqueIds.forEach((id, index) => {
    idMap.set(id, index + 1); 
  });

  const { keypoints, lines, keypointLabels } = getKeypointAnnotation(state);


  const bboxAnnotations = state.canvasElements
    .toArray()
    .filter(el => el.type === "rectangle")
    .map(el => {
      return {
        id: idMap.get(el.id) ?? 0,
        image_id: 0,
        category_id: 1,
        bbox: [
          el.props.x ?? 0,
          el.props.y ?? 0,
          el.props.width ?? 0,
          el.props.height ?? 0,
        ] as [number, number, number, number],
        area: (el.props.width ?? 0) * (el.props.height ?? 0),
        iscrowd: 0 as const,
      };
    });

  const keypointAnnotation = {
    id: bboxAnnotations.length + 1,
    image_id: 0,
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
  };

  const numericLines: [number, number][] = lines.map(([startId, endId]) => [
    idMap.get(startId) ?? 0,
    idMap.get(endId) ?? 0,
  ]);

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
          name: "bird",
          supercategory: SUPERCATEGORY,
          keypoints: keypointLabels,
          skeleton: numericLines,
        },
      ],
      [
        {
          id: 0,
          license: 0,
          file_name: "test.jpg",
          height: 0,
          width: 0,
          date_captured: new Date().toISOString(),
        },
      ],
      [...bboxAnnotations, keypointAnnotation],
    ),
  );
};


function CanvasExport(state: CanvasState, export_type: canvasExportTypes): string {
  switch (export_type) {
    case 'COCOJSON':
      return stateToCoco(state)
  }
}

export default CanvasExport

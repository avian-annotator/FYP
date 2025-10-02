const canvasColour = Array.from({ length: 100 }, (_, i) => `hsl(${String(i * 137.5)}deg 70% 60%)`)

const getColor = (i: number) => canvasColour[i % canvasColour.length]
const getBackgroundColor = (i: number) => getColor(i).slice(0, -4) + '80% / 0.2)'

export { getColor, getBackgroundColor }

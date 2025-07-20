import { CanvasColour, CanvasObject, Coord, canvasColour } from '../CanvasUtils'

class BoundingBox implements CanvasObject {
  public constructor(
    public id: number,
    public start: Coord,
    public end: Coord,
    public colour: CanvasColour | null,
  ) {}

  public getCanvasObjectElement = () => {
    const left = Math.min(this.start.x, this.end.x)
    const top = Math.min(this.start.y, this.end.y)
    const width = Math.abs(this.end.x - this.start.x)
    const height = Math.abs(this.end.y - this.start.y)
    const c = this.colour ?? canvasColour[this.id % canvasColour.length]
    return (
      <div
        key={this.id}
        className="absolute border-2 pointer-events-none bounding-box"
        style={{
          left,
          top,
          width,
          height,
          borderColor: c,
          backgroundColor: c.slice(0, -4) + '80% / 0.2)',
        }}
      ></div>
    )
  }
}

export default BoundingBox

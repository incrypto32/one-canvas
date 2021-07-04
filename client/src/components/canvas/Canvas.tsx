import React, { Component, RefObject } from "react";
import { CanvasController } from "../../logic/canvas";

export interface ICanvasProps {
  name: string;
}

interface IState {
  num?: number;
  blah?: string;
}

export class OneCanvas extends Component<ICanvasProps, IState> {
  canvasRef: RefObject<HTMLCanvasElement>;
  controller!: CanvasController;
  ctx!: CanvasRenderingContext2D;
  state: IState = {
    num: 0,
    blah: "hat",
  };

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.current!;
  }

  constructor(props: ICanvasProps) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount = () => {
    console.log("Did mount");
    this.ctx = this.canvas.getContext("2d")!;

    this.controller = new CanvasController(this.canvas, {
      onClicked: this.onCanvasClicked,
      draw: this.draw,
      zoomOnMouseScroll: true,
    });
  };

  onCanvasClicked = (x: number, y: number) => {
    console.log(`x : ${x} , y : ${y}`);
    this.controller.colorPixel(x, y, "#000000");
  };

  draw = (scale: number) => {
    let ctx = this.ctx;
    ctx.scale(scale, scale);
    console.log(scale);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.font = "48px serif";
    ctx.strokeText("Hello world", 250, 250);
  };

  public render(): JSX.Element {
    return (
      <>
        <canvas width="500" height="500" ref={this.canvasRef}></canvas>
      </>
    );
  }
}
export default OneCanvas;

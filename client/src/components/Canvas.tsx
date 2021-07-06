import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { Component } from "react";
import { Stage, Layer, Rect, Group, Image } from "react-konva";
import useImage from "use-image";
import { Color, ColorContext } from "../context/ColorContext";
import { SmartMock } from "../logic/SmartMock";

export interface ICanvasProps {
  name: string;
}

interface IState {
  canvas: CanvasImageSource | undefined;
}

export class OneCanvas extends Component<ICanvasProps, IState> {
  scaleFactor = 1.1;
  scale = 1;
  innerCanvasSize = 1000;
  canvasPosition!: { x: number; y: number };
  stageRef = React.createRef<Konva.Stage>();
  canvasRef = React.createRef<Konva.Group>();
  layerRef = React.createRef<Konva.Layer>();
  imageRef = React.createRef<Konva.Image>();
  smartMock = new SmartMock();
  imgData = new Uint8ClampedArray(
    4 * this.innerCanvasSize * this.innerCanvasSize
  );

  static contextType = ColorContext;
  state: IState = {
    canvas: document.createElement("canvas"),
  };

  constructor(props: ICanvasProps) {
    super(props);
    this.scale = (0.5 * window.innerWidth) / this.innerCanvasSize;
    this.canvasPosition = {
      x: (window.innerWidth / this.scale - this.innerCanvasSize) / 2,
      y: (window.innerHeight / this.scale - this.innerCanvasSize) / 2,
    };
  }

  componentDidMount() {
    let ctx = this.layerRef.current?.getContext()._context!;
    ctx.imageSmoothingEnabled = false;
    this.setState({ canvas: this.smartMock.getPixels() as any });
  }

  onWheel = (e: KonvaEventObject<WheelEvent>) => {
    var stage = this.stageRef.current!;

    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var pointer = stage.getPointerPosition()!;

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    this.scale =
      e.evt.deltaY > 0
        ? this.scale / this.scaleFactor
        : this.scale * this.scaleFactor;

    stage.scale({ x: this.scale, y: this.scale });

    var newPos = {
      x: pointer.x - mousePointTo.x * this.scale,
      y: pointer.y - mousePointTo.y * this.scale,
    };
    stage.position(newPos);
  };

  a = (imgData: Uint8ClampedArray) => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    let imageData = new ImageData(imgData, 1000);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    context?.putImageData(imageData, 0, 0);
    this.setState({ canvas });
  };
  
  b = (imgData: Uint8ClampedArray) => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    let imageData = new ImageData(imgData, 1000);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    context?.putImageData(imageData, 0, 0);
    return canvas;
  };

  modifyPixel(x: number, y: number, context: Color) {
    var i = 4 * (x + this.innerCanvasSize * y); // 4x+ly
    let data = this.imgData!;
    console.log(context.rgba);
    data[i] = context.rgba.r;
    data[i + 1] = context.rgba.g;
    data[i + 2] = context.rgba.b;
    data[i + 3] = 255;

    this.a(data);
  }

  public render(): JSX.Element {
    return (
      <>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          className="absolute bg-gray-300 "
          style={{ zIndex: 0 }}
          draggable={true}
          scaleX={this.scale}
          scaleY={this.scale}
          ref={this.stageRef}
          onWheel={this.onWheel}
        >
          <Layer ref={this.layerRef}>
            <Group
              width={this.innerCanvasSize}
              height={this.innerCanvasSize}
              x={this.canvasPosition.x}
              y={this.canvasPosition.y}
              ref={this.canvasRef}
            >
              <Rect
                width={this.innerCanvasSize}
                height={this.innerCanvasSize}
                fill="white"
                shadowColor="gray"
                shadowOffsetX={5}
                shadowOffsetY={5}
                shadowBlur={10}
                shadowEnabled={true}
              />
              <Image
                image={this.state.canvas}
                ref={this.imageRef}
                perfectDrawEnabled={false}
                onClick={(e) => {
                  var rect = this.imageRef.current;
                  var pos = rect?.getRelativePointerPosition()!;

                  console.log(Math.floor(pos.x), Math.floor(pos.y));
                  this.modifyPixel(
                    Math.floor(pos.x),
                    Math.floor(pos.y),
                    this.context
                  );
                }}
              />
            </Group>

            {}
          </Layer>
        </Stage>
      </>
    );
  }
}
export default OneCanvas;

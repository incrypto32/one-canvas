import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { Component } from "react";
import { Stage, Layer, Rect, Group, Image } from "react-konva";

export interface ICanvasProps {
  name: string;
}

interface IState {
  num?: number;
  blah?: string;
}

export class OneCanvas extends Component<ICanvasProps, IState> {
  scaleFactor = 1.1;
  scale = 0.8;
  innerCanvasSize = 1000;
  stageRef = React.createRef<Konva.Stage>();
  canvasRef = React.createRef<Konva.Group>();
  layerRef = React.createRef<Konva.Layer>();
  state: IState = {
    num: 0,
    blah: "hat",
  };

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

  a = () => {
    var canvas = new HTMLCanvasElement();
    var context = canvas.getContext("2d");
    const arr = new Uint8ClampedArray(4 * 1000 * 1000);
    let imageData = new ImageData(arr, 1000);
  };

  public render(): JSX.Element {
    return (
      <>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          className="bg-gray-300"
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
              x={(window.innerWidth / this.scale - this.innerCanvasSize) / 2}
              y={(window.innerHeight / this.scale - this.innerCanvasSize) / 2}
              ref={this.canvasRef}
            >
              <Rect
                width={this.innerCanvasSize}
                height={this.innerCanvasSize}
                fill="white"
                onClick={(e) => {
                  var rect = this.canvasRef.current;
                  var pos = rect?.getRelativePointerPosition()!;
                  console.log(Math.floor(pos.x), Math.floor(pos.y));
                  var shape = new Konva.Rect({
                    x: Math.floor(pos.x),
                    y: Math.floor(pos.y),
                    fill: "red",
                    width: 1,
                    height: 1,
                  });
                  this.canvasRef.current?.add(shape);
                  console.log(this.canvasRef.current?.toObject());
                }}
                shadowColor="gray"
                shadowOffsetX={5}
                shadowOffsetY={5}
                shadowBlur={10}
                shadowEnabled={true}
              />
              {/* <Image image={}/> */}
            </Group>

            {}
          </Layer>
        </Stage>
      </>
    );
  }
}
export default OneCanvas;

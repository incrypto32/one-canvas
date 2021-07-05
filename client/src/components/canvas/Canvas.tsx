import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { Component } from "react";
import { Stage, Layer, Rect, Group, Image } from "react-konva";
import _ from "lodash";

export interface ICanvasProps {
  name: string;
}

interface IState {
  imgData: Uint8ClampedArray;
}

export class OneCanvas extends Component<ICanvasProps, IState> {
  scaleFactor = 1.1;
  scale = 0.8;
  innerCanvasSize = 1000;
  stageRef = React.createRef<Konva.Stage>();
  canvasRef = React.createRef<Konva.Group>();
  layerRef = React.createRef<Konva.Layer>();

  state: IState = {
    imgData: new Uint8ClampedArray(
      4 * this.innerCanvasSize * this.innerCanvasSize
    ),
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

    let imageData = new ImageData(this.state.imgData, 1000);
  };

  modifyPixel(x: number, y: number) {
    var i = 4 * (x + this.innerCanvasSize * y); // 4x+ly
    let data = _.cloneDeep(this.state.imgData);
    data[i] = 255;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 1;
    this.setState({ imgData: data });
  }

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

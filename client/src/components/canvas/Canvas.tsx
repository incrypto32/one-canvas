import Konva from "konva";
import { Layer as KonvaLayer } from "konva/lib/Layer";
import * as shapes from "konva/lib/shapes/Rect";
import { Stage as KonvaStage } from "konva/lib/Stage";
import React, { Component } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";
import { CanvasController } from "../../logic/canvas";

export interface ICanvasProps {
  name: string;
}

interface IState {
  num?: number;
  blah?: string;
}

export class OneCanvas extends Component<ICanvasProps, IState> {
  controller!: CanvasController;
  ctx!: CanvasRenderingContext2D;
  scaleBy = 1.1;
  stageRef = React.createRef<KonvaStage>();
  canvasRef = React.createRef<shapes.Rect>();
  layerRef = React.createRef<KonvaLayer>();
  state: IState = {
    num: 0,
    blah: "hat",
  };

  public render(): JSX.Element {
    return (
      <>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          className="bg-gray-300"
          draggable={true}
          ref={this.stageRef}
          onWheel={(e) => {
            var stage = this.stageRef.current!;
            e.evt.preventDefault();
            var oldScale = stage.scaleX();

            var pointer = stage.getPointerPosition()!;

            var mousePointTo = {
              x: (pointer.x - stage.x()) / oldScale,
              y: (pointer.y - stage.y()) / oldScale,
            };

            var newScale =
              e.evt.deltaY > 0
                ? oldScale / this.scaleBy
                : oldScale * this.scaleBy;

            stage.scale({ x: newScale, y: newScale });

            var newPos = {
              x: pointer.x - mousePointTo.x * newScale,
              y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
          }}
        >
          <Layer ref={this.layerRef}>
           
            <Rect
              width={800}
              height={800}
              x={window.innerWidth / 2 - 400}
              y={window.innerHeight / 2 - 400}
              fill="white"
              ref={this.canvasRef}
              onClick={(e) => {
                var rect = this.canvasRef.current;
                var pos = rect?.getRelativePointerPosition()!;
                var shape = new Konva.Circle({
                  x: pos.x,
                  y: pos.y,
                  fill: "red",
                  radius: 20,
                });
                this.layerRef.current?.add(shape);
              }}
              shadowColor="gray"
              shadowOffsetX={5}
              shadowOffsetY={5}
              shadowBlur={10}
              shadowEnabled={true}
            />
            {/* <Circle
              x={window.innerWidth / 2}
              y={window.innerHeight / 2}
              stroke="red"
              fill="green"
              radius={50}
            />
            <Rect
              width={10}
              height={10}
              x={window.innerWidth / 2 - 5}
              y={window.innerHeight / 2 - 5}
              fill="blue"
              onClick={(e) => {}}
            /> */}
            {}
          </Layer>
        </Stage>
      </>
    );
  }
}
export default OneCanvas;

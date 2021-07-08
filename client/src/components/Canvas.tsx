import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { Component } from "react";
import { Stage, Layer, Rect, Group, Image } from "react-konva";
import { ColorContext, RGBA } from "../context/ColorContext";
import { SmartMock } from "../logic/SmartMock";
import { ConfirmPixelDialogue } from "./modals/ConfirmPixel";

interface ICanvasProps {
  name: string;
}

interface IState {
  canvas: CanvasImageSource | undefined;
  showModal: boolean;
}

interface IPixelData {
  pos: { x: number; y: number };
  price: string;
}

export class OneCanvas extends Component<ICanvasProps, IState> {
  scaleFactor = 1.1;
  scale = 1;
  canvasSize = 1000;
  canvasPosition!: { x: number; y: number };
  stageRef = React.createRef<Konva.Stage>();
  canvasRef = React.createRef<Konva.Group>();
  layerRef = React.createRef<Konva.Layer>();
  imageRef = React.createRef<Konva.Image>();
  smartMock = new SmartMock();
  imgData = new Uint8ClampedArray(4 * this.canvasSize * this.canvasSize);
  selectedPixel: IPixelData = { pos: { x: 0, y: 0 }, price: "0" };
  static contextType = ColorContext;

  state: IState = {
    canvas: document.createElement("canvas"),
    showModal: false,
  };

  constructor(props: ICanvasProps) {
    super(props);
    this.scale = (0.5 * window.innerWidth) / this.canvasSize;
    this.canvasPosition = {
      x: (window.innerWidth / this.scale - this.canvasSize) / 2,
      y: (window.innerHeight / this.scale - this.canvasSize) / 2,
    };
  }

  componentDidMount() {
    let ctx = this.layerRef.current?.getContext()._context!;
    ctx.imageSmoothingEnabled = false;
    this.smartMock.updatePixelArray(this.imgData);
    this.setCanvasState(this.imgData);
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

  onScreenTapped = (e: KonvaEventObject<Event | MouseEvent>) => {
    var rect = this.imageRef.current;
    var pos = rect?.getRelativePointerPosition()!;
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    this.selectedPixel = { pos: pos, price: "0" };
    this.setState({ showModal: true });
  };

  setCanvasState = (imgData: Uint8ClampedArray) => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    let imageData = new ImageData(imgData, 1000);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    context?.putImageData(imageData, 0, 0);
    this.setState({ canvas });
  };

  modifyPixel(x: number, y: number, rgba: RGBA) {
    var i = 4 * (x + this.canvasSize * y); // 4x+ly
    let data = this.imgData!;
    data[i] = rgba.r;
    data[i + 1] = rgba.g;
    data[i + 2] = rgba.b;
    data[i + 3] = 255;
    this.setCanvasState(data);
  }

  public render(): JSX.Element {
    return (
      <>
        <ConfirmPixelDialogue
          showModal={this.state.showModal}
          setShowModal={(showModal) => {
            this.setState({ showModal: showModal });
          }}
          onConfirmed={() => {
            let pos = this.selectedPixel.pos;
            this.modifyPixel(pos.x, pos.y, this.context.rgba);
            console.log("Confirmed");
          }}
        />

        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          className="absolute bg-gray-300 "
          style={{ zIndex: 0 }}
          draggable={true}
          scaleX={this.scale}
          scaleY={this.scale}
          ref={this.stageRef}
          onWheel={this.onWheel}>
          <Layer ref={this.layerRef}>
            <Group
              width={this.canvasSize}
              height={this.canvasSize}
              x={this.canvasPosition.x}
              y={this.canvasPosition.y}
              ref={this.canvasRef}>
              <Rect
                width={this.canvasSize}
                height={this.canvasSize}
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
                onTap={this.onScreenTapped}
                onClick={this.onScreenTapped}
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

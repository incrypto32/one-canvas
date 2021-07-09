import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, {
  Component,
  useState,
  createRef,
  useEffect,
  useContext,
} from "react";
import { Stage, Layer, Rect, Group, Image } from "react-konva";
import { ColorContext, RGBA } from "../context/ColorContext";
import { SmartMock } from "../logic/SmartMock";
import { ConfirmPixelDialogue } from "./modals/ConfirmPixel";

interface IState {
  canvas: CanvasImageSource | undefined;
  showModal: boolean;
}

interface IPixelData {
  pos: { x: number; y: number };
  price: string;
}

export const PixelCanvas: React.FC = () => {
  const scaleFactor = 1.1;
  const stageRef = createRef<Konva.Stage>();
  const canvasRef = createRef<Konva.Group>();
  const layerRef = createRef<Konva.Layer>();
  const imageRef = createRef<Konva.Image>();
  const canvasSize = 1000;
  var scale = (0.5 * window.innerWidth) / canvasSize;
  var canvasPosition: { x: number; y: number } = {
    x: (window.innerWidth / scale - canvasSize) / 2,
    y: (window.innerHeight / scale - canvasSize) / 2,
  };

  const [imgData, setimgData] = useState(
    new Uint8ClampedArray(4 * canvasSize * canvasSize)
  );
  var smartMock = new SmartMock();

  const context = useContext(ColorContext);
  const [selectedPixel, setSelectedPixel] = useState<IPixelData>({
    pos: { x: 0, y: 0 },
    price: "0",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<CanvasImageSource | undefined>(
    document.createElement("canvas")
  );

  useEffect(() => {
    let ctx = layerRef.current?.getContext()._context!;
    ctx.imageSmoothingEnabled = false;
    smartMock.updatePixelArray(imgData);
    setCanvasState(imgData);
  }, []);

  const setCanvasState = (imgData: Uint8ClampedArray) => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    let imageData = new ImageData(imgData, 1000);
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    context?.putImageData(imageData, 0, 0);
    setCanvas(canvas);
  };

  const modifyPixel = (x: number, y: number, rgba: RGBA) => {
    var i = 4 * (x + canvasSize * y); // 4x+ly
    let data = imgData!;
    data[i] = rgba.r;
    data[i + 1] = rgba.g;
    data[i + 2] = rgba.b;
    data[i + 3] = 255;
    setCanvasState(data);
  };

  const onScreenTapped = (e: KonvaEventObject<Event | MouseEvent>) => {
    var rect = imageRef.current;
    var pos = rect?.getRelativePointerPosition()!;
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    setSelectedPixel({ pos: pos, price: "0" });
    setShowModal(true);
  };

  const onWheel = (e: KonvaEventObject<WheelEvent>) => {
    var stage = stageRef.current!;
    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var pointer = stage.getPointerPosition()!;

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    scale = e.evt.deltaY > 0 ? scale / scaleFactor : scale * scaleFactor;

    stage.scale({ x: scale, y: scale });

    var newPos = {
      x: pointer.x - mousePointTo.x * scale,
      y: pointer.y - mousePointTo.y * scale,
    };
    stage.position(newPos);
  };
  return (
    <>
      <ConfirmPixelDialogue
        showModal={showModal}
        setShowModal={(showModal) => {
          setShowModal(showModal);
        }}
        onConfirmed={() => {
          let pos = selectedPixel.pos;
          modifyPixel(pos.x, pos.y, context!.rgba);
          console.log("Confirmed");
        }}
      />

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute bg-gray-300 "
        style={{ zIndex: 0 }}
        draggable={true}
        scaleX={scale}
        scaleY={scale}
        ref={stageRef}
        onWheel={onWheel}>
        <Layer ref={layerRef}>
          <Group
            width={canvasSize}
            height={canvasSize}
            x={canvasPosition.x}
            y={canvasPosition.y}
            ref={canvasRef}>
            <Rect
              width={canvasSize}
              height={canvasSize}
              fill="white"
              shadowColor="gray"
              shadowOffsetX={5}
              shadowOffsetY={5}
              shadowBlur={10}
              shadowEnabled={true}
            />
            <Image
              image={canvas}
              ref={imageRef}
              perfectDrawEnabled={false}
              onTap={onScreenTapped}
              onClick={onScreenTapped}
            />
          </Group>

          { }
        </Layer>
      </Stage>
    </>
  );
};
export default PixelCanvas;

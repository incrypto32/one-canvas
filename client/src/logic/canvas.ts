export interface IControllerArgs {
  onClicked: (x: number, y: number) => void;
  draw: (scale: number) => void;
  zoomOnMouseScroll: boolean;
}

export class CanvasController {
  canvas: HTMLCanvasElement;
  draw = () => {};
  msPt: { x: number; y: number } = { x: 0, y: 0 };
  scale = 1.0;
  scaleFactor = 0.9;

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d")!;
  }

  constructor(
    canvas: HTMLCanvasElement,

    settings: IControllerArgs
  ) {
    this.canvas = canvas;

    this.init(settings);
  }

  init(args: IControllerArgs) {
    this._mouseTracker(this.canvas);
    if (args.draw)
      this.draw = () => {
        this.clear();

        args.draw(this.scale);
      };

    this.draw();

    if (args.onClicked)
      this.canvas.onclick = (e) => {
        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        args.onClicked(x, y);
      };

    if (args.zoomOnMouseScroll) {
      console.log("ZOOM");
      this.canvas.onwheel = (e) => {
        console.log("WHEEL");

        var wheel = (e as any).wheelDelta / 120 === 1 ? true : false;
        if (wheel) {
          this.scale /= this.scaleFactor;
        } else {
          this.scale *= this.scaleFactor;
        }

        this.ctx.translate(this.msPt.x, this.msPt.y);
        this.draw();
        this.ctx.translate(-this.msPt.x, -this.msPt.y);
      };
    }
  }

  private _mouseTracker(canvas: HTMLCanvasElement) {
    canvas.onmousemove = (e) => {
      let rect = this.canvas.getBoundingClientRect();
      this.msPt.x = e.clientX - rect.left;
      this.msPt.y = e.clientY - rect.top;
    };
  }

  //   private pointMatrixTransform(x: number, y: number) {
  //   this.ctx.transform
  //   }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private _hexToRGB(
    hex: string,
    a = 1
  ): { r: number; g: number; b: number; a: number } {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b, a: a };
  }

  public colorPixel(x: number, y: number, hex: string) {
    var imgData = this.ctx.createImageData(1, 1);
    var data = imgData.data;
    var color = this._hexToRGB(hex);
    data[0] = color.r;
    data[1] = color.g;
    data[2] = color.b;
    data[3] = color.a;
    this.ctx.putImageData(imgData, x, y);
  }
}

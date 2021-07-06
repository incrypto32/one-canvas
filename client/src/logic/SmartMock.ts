import useImage from "use-image";
export class SmartMock {
  getPixels() {
    let img = new Image()
    img.src =  "https://wallpaperaccess.com/download/1000x1000-1516365"
    return img;
  }
}

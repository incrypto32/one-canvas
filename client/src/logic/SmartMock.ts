export class SmartMock {
  updatePixelArray(pixArray: Uint8ClampedArray) {
    pixArray[0] = 255;
    pixArray[1] = 0;
    pixArray[2] = 0;
    pixArray[3] = 255;
  }
}

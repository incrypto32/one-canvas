import React from "react";
import { RGBA } from "../context/ColorContext";
import OneCanvas from "./Canvas";
import { ColorPallete } from "./ColorPallete";
import "animate.css";
import PixelCanvas from "./PixelCanvas";

export const Main: React.FC = (props) => {
  const colorList: RGBA[] = [
    { r: 255, g: 255, b: 255 },
    { r: 228, g: 228, b: 228 },
    { r: 136, g: 136, b: 136 },
    { r: 34, g: 34, b: 34 },
    { r: 255, g: 167, b: 209 },
    { r: 229, g: 0, b: 0 },
    { r: 229, g: 149, b: 0 },
    { r: 160, g: 106, b: 66 },
    { r: 229, g: 217, b: 0 },
    { r: 148, g: 224, b: 68 },
    { r: 2, g: 190, b: 1 },
    { r: 0, g: 211, b: 221 },
    { r: 0, g: 131, b: 199 },
    { r: 0, g: 0, b: 234 },
    { r: 207, g: 110, b: 228 },
    { r: 130, g: 0, b: 128 },
  ];
  return (
    <div className="box-border h-screen mx-auto flex flex-col justify-center items-center">
      <div className="flex-grow"></div>
      {/* <OneCanvas name="One Canvas" /> */}
      <PixelCanvas />
      <ColorPallete rgba={colorList} />
    </div>
  );
};

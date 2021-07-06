import React, { useContext, useState } from "react";
import { ColorContext, RGBA } from "../context/ColorContext";

export const ColorPallete: React.FC<{ rgba: RGBA[] }> = (props) => {
  const value = useContext(ColorContext)!;
  const [selectedColor, setSelectedColor] = useState<number>(0);
  return (
    <div className="z-10  m-3">
      <div className="grid grid-cols-8 shadow-xl bg-gray-100 rounded-xl p-2 border border-gray-400">
        {props.rgba.map((e, i) => (
          <div
            className={
              `p-5 rounded-full m-0.5 shadow-md ` +
              (selectedColor === i
                ? "border-2 border-black"
                : "border border-black")
            }
            style={{ background: `rgba(${e.r},${e.g},${e.b},1)` }}
            key={i}
            onClick={() => {
              setSelectedColor(i);
              value.setColor(e);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

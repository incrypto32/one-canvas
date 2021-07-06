import React from "react";

export interface RGBA {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  rgba: RGBA;
  setColor: (rgba: RGBA) => void;
}

export const ColorContext = React.createContext<Color | null>({
  rgba: {
    r: 0,
    g: 0,
    b: 0,
  },
  setColor: (rgba) => {
    console.warn("No Color Provider Setup ");
  },
});

export const ColorProvider: React.FC = (props) => {
  const [color, setColor] = React.useState<RGBA>({
    r: 0,
    g: 0,
    b: 0,
  });

  return (
    <ColorContext.Provider value={{ rgba: color, setColor: setColor }}>
      {props.children}
    </ColorContext.Provider>
  );
};

export const ColorConsumer = ColorContext.Consumer;

import { ReactElement } from "react";
import Ogma, { Point } from "@linkurious/ogma";

export type Placement = "top" | "bottom" | "left" | "right" | "center";

export type PositionGetter = (ogma: Ogma) => Point | null;

export type Content =
  | string
  | ReactElement
  | ((ogma: Ogma, position: Point) => ReactElement);

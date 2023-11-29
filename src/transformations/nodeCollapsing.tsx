import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NodeCollapsingOptions,
  NodeCollapsing as NodeCollapsingTransformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

export interface NodeCollapsingProps<ND, ED>
  extends NodeCollapsingOptions<ND, ED>,
    TransformationProps {}

export function NodeCollapsingComponent<ND = any, ED = any>(
  props: NodeCollapsingProps<ND, ED>,
  ref: Ref<NodeCollapsingTransformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] =
    useState<NodeCollapsingTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeCollapsing({
      ...props,
      enabled: !props.disabled,
    });
    useTransformationCallbacks(props, newTransformation, ogma);
    setTransformation(newTransformation);

    return () => {
      newTransformation.destroy();
      setTransformation(undefined);
    };
  }, []);

  useEffect(() => {
    if (transformation) {
      toggle(transformation, !!props.disabled, props.duration);
    }
  }, [props.disabled]);

  useEffect(() => {
    transformation?.setOptions(props);
  }, [props.edgeGenerator, props.selector]);

  return null;
}

export const NodeCollapsing = forwardRef(NodeCollapsingComponent);

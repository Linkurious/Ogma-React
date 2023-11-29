import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NodeFilterOptions,
  NodeFilter as NodeFilterTransformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

export interface NodeFilterProps<ED, ND>
  extends NodeFilterOptions<ED, ND>,
    TransformationProps {}

function NodeFilterComponent<ND = any, ED = any>(
  props: NodeFilterProps<ND, ED>,
  ref?: Ref<NodeFilterTransformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] =
    useState<NodeFilterTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeFilter({
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
  }, [props.criteria]);

  return null;
}

/**
 * Edge Filter transformation component. It wraps around Ogma [`NodeFilter` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeFilter).
 */
export const NodeFilter = forwardRef(NodeFilterComponent);

import OgmaLib, {
  NodeSelector,
  EdgeSelector,
  NodeAttributesValue,
  EdgeAttributesValue,
  StyleRule,
} from "@linkurious/ogma";
import { useEffect, RefCallback, useState } from "react";
import { useOgma } from "../context";

interface WithRuleRef<ND, ED> {
  ruleRef?: RefCallback<StyleRule<ND, ED>>;
}

interface NodeRuleProps<ND, ED> extends WithRuleRef<ND, ED> {
  selector?: NodeSelector<ND, ED>;
  attributes: NodeAttributesValue<ND, ED>;
}

export const NodeStyleRule = <ND, ED>({
  ruleRef,
  selector,
  attributes,
}: NodeRuleProps<ND, ED>) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  //const [rule, setRule] = useState<StyleRule<ND, ED>>();
  useEffect(() => {
    const nodeRule = selector
      ? ogma.styles.addNodeRule(selector, attributes)
      : ogma.styles.addNodeRule(attributes);
    if (ruleRef) ruleRef(nodeRule);
    //setRule(nodeRule);
    return () => {
      nodeRule.destroy();
    };
  }, [selector, attributes]);
  return null;
};

interface EdgeRuleProps<ND, ED> extends WithRuleRef<ND, ED> {
  selector?: EdgeSelector<ED, ND>;
  attributes: EdgeAttributesValue<ED, ND>;
}

export const EdgeStyleRule = <ND, ED>({
  ruleRef,
  selector,
  attributes,
}: EdgeRuleProps<ND, ED>) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  //const [rule, setRule] = useState<StyleRule<ND, ED>>();
  useEffect(() => {
    //if (rule) rule.destroy();
    const edgeRule = selector
      ? ogma.styles.addEdgeRule(selector, attributes)
      : ogma.styles.addEdgeRule(attributes);
    if (ruleRef) ruleRef(edgeRule);
    //setRule(edgeRule);
    return () => {
      edgeRule.destroy();
    };
  }, [selector, attributes]);
  return null;
};

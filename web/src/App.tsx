import OgmaLib, {
  Edge,
  Node,
  Point,
  RawGraph,
  Transformation,
} from "@linkurious/ogma";
import React, { useEffect, useState } from "react";
import {
  Ogma,
  NodeStyleRule,
  EdgeStyleRule,
  Tooltip,
  NodeGrouping,
  Popup,
} from "../../src";
import { LayoutService } from "./LayoutService";

export default function App() {
  const graph: RawGraph = {
    nodes: [
      { id: 0, attributes: { color: "red", x: 0, y: 0 } },
      { id: 1, attributes: { color: "green", x: 25, y: 0 } },
      { id: 2, attributes: { color: "green", x: 25, y: 0 } },
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
    ],
  };

  const [popupOpen, setPopupOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState<Node>(null);

  const ref = React.createRef<OgmaLib>();
  const groupingRef = React.createRef<Transformation>();

  const [tooltipPositon, setTooltipPosition] = useState<Point>();
  const [target, setTarget] = useState<Node | Edge | null>();

  return (
    <div className="App">
      <Ogma
        ref={ref}
        graph={graph}
        onReady={(ogma) => {
          ogma.events
            .on("click", ({ target }) => {
              if (target && target.isNode) {
                setClickedNode(target);
                setPopupOpen(true);
              }
            })
            // .on('mouseover', ({ target }) => )
            .on("mousemove", (evt) => {
              const ptr = ogma.getPointerInformation();
              //setTarget(ptr.target);
              setTooltipPosition(
                ogma.view.screenToGraphCoordinates({ x: ptr.x, y: ptr.y })
              );
              setTarget(ptr.target);
            });
        }}
      >
        <NodeStyleRule attributes={{ color: "#247BA0", radius: 2 }} />
        <EdgeStyleRule attributes={{ color: "#247BA0", width: 0.15 }} />
        {/* <LayoutService /> */}
        <Popup
          position={() => (clickedNode ? clickedNode.getPosition() : null)}
          onClose={() => setPopupOpen(false)}
          isOpen={popupOpen}
        >
          {clickedNode && (
            <div className="content">{`Node ${clickedNode.getId()}:`}</div>
          )}
        </Popup>
        <Tooltip placement="top" position={tooltipPositon}>
          <div className="x">
            {target
              ? `${target.isNode ? "Node" : "Edge"} #${target.getId()}`
              : "nothing"}
          </div>
        </Tooltip>
        <NodeGrouping
          ref={groupingRef}
          groupIdFunction={(node) => {
            const id = Number(node.getId());
            return id === 1 || id === 2 ? "grouped" : undefined;
          }}
          duration={1000}
        />
      </Ogma>
    </div>
  );
}

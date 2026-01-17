"use client";

import { useNode, Canvas } from "@craftjs/core";

export const Container = ({ children }: any) => {
  const {
    connectors: { drag },
  } = useNode();

  return (
    <div ref={drag} style={{ padding: 20, border: "1px dashed #ccc" }}>
      <Canvas id="drop_section">
        {children}
      </Canvas>
    </div>
  );
};

Container.craft = {
  displayName: "Container",
};

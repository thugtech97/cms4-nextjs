"use client";

import { useNode } from "@craftjs/core";

type Props = {
  text: string;
};

export const TextComponent = ({ text }: Props) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <p ref={(ref) => ref && connect(drag(ref))}>
      {text}
    </p>
  );
};

TextComponent.craft = {
  displayName: "Text",
  props: {
    text: "Editable text",
  },
};

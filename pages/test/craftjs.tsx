"use client";

import React from "react";
import { Editor, Frame, Canvas } from "@craftjs/core";
import { TextComponent } from "@/components/craft/TextComponent";
import { Container } from "@/components/craft/Container";

import AdminLayout from "@/components/Layout/AdminLayout";

export default function Page() {
  return (
    <div>
      <header>Some fancy header or whatever</header>

      <Editor
        resolver={{
          TextComponent,
          Container,
        }}
      >
        {/* Editable area starts here */}
        <Frame>
          <Canvas>
            <TextComponent text="I'm already rendered here" />
          </Canvas>
        </Frame>
      </Editor>
    </div>
  );
}

Page.Layout = AdminLayout
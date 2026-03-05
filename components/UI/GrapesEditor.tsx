"use client";

import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import grapesjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import grapesjsPluginForms from "grapesjs-plugin-forms";
import "grapesjs/dist/css/grapes.min.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";

type GrapesEditorProps = {
  value?: string;
  onChange: (content: string) => void;
  height?: number;
};

const extractContentParts = (html: string): { body: string; css: string; js: string } => {
  const raw = html || "";
  const styleMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const scriptMatch = raw.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

  const css = styleMatch?.[1] || "";
  const js = scriptMatch?.[1] || "";

  let body = raw;
  if (styleMatch?.[0]) body = body.replace(styleMatch[0], "");
  if (scriptMatch?.[0]) body = body.replace(scriptMatch[0], "");

  return { body: body.trim(), css, js };
};

const extractFileList = (input: any): File[] => {
  if (!input) return [];
  if (input instanceof File) return [input];
  if (input instanceof FileList) return Array.from(input);
  if (Array.isArray(input)) return input.filter((item) => item instanceof File);

  const dropFiles = input?.dataTransfer?.files;
  if (dropFiles instanceof FileList) return Array.from(dropFiles);

  const targetFiles = input?.target?.files;
  if (targetFiles instanceof FileList) return Array.from(targetFiles);

  return [];
};

export default function GrapesEditor({ value = "", onChange, height = 800 }: GrapesEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);
  const lastEmittedRef = useRef<string>("");
  const jsRef = useRef<string>("");

  useEffect(() => {
    if (!hostRef.current || editorRef.current) return;

    const { body, css, js } = extractContentParts(value);
    jsRef.current = js;

    const editor = grapesjs.init({
      container: hostRef.current,
      fromElement: false,
      height: `${height}px`,
      storageManager: false,
      plugins: [grapesjsPresetWebpage, grapesjsBlocksBasic, grapesjsPluginForms],
      assetManager: {
        upload: false,
        uploadFile: async (event: any) => {
          const files = extractFileList(event);
          if (!files.length) return;

          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));

          try {
            const res = await fetch("/api/assets/upload", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              throw new Error("Upload failed");
            }

            const data = await res.json();
            const urls = Array.isArray(data?.urls) ? data.urls.filter(Boolean) : [];

            if (!urls.length) return;

            editor.AssetManager.add(
              urls.map((url: string) => ({
                src: url,
                type: "image",
              }))
            );
          } catch (error) {
            console.error("Grapes asset upload failed:", error);
            if (typeof window !== "undefined") {
              window.alert("Asset upload failed. Please try again.");
            }
          }
        },
      },
      codeManager: {
        optsCodeViewer: {
          readOnly: 0,
          lineWrapping: true,
          autoRefresh: true,
        },
      },
      selectorManager: { componentFirst: true },
      components: body || "<div>Start building your page...</div>",
      style: css,
    });

    const buildContent = (ed: any) => {
      const html = ed.getHtml() || "";
      const styles = ed.getCss() || "";
      const script = (jsRef.current || "").trim();
      const cssTag = styles ? `\n<style>${styles}</style>` : "";
      const jsTag = script ? `\n<script>${script}</script>` : "";
      return `${html}${cssTag}${jsTag}`.trim();
    };

    const openCodeModal = async (ed: any) => {
        const modal = ed.Modal;
      const CodeMirror = (await import("codemirror")).default;
      const beautifyModule: any = await import("js-beautify");
      const baseEditorHeight = 300;
      let isStretched = false;

      const resetCodeCommandState = () => {
        try {
          ed.stopCommand("cms:open-code");
        } catch {}
        try {
          ed.stopCommand("core:open-code");
        } catch {}
      };

      const beautifyHtml = beautifyModule?.html || beautifyModule?.default?.html;
      const beautifyCss = beautifyModule?.css || beautifyModule?.default?.css;
      const beautifyJs = beautifyModule?.js || beautifyModule?.default?.js;

      const formatByType = (code: string, type: "html" | "css" | "js") => {
        const source = code || "";
        if (!source.trim()) return "";

        const options = {
          indent_size: 2,
          preserve_newlines: true,
          max_preserve_newlines: 2,
          end_with_newline: false,
        };

        try {
          if (type === "html" && typeof beautifyHtml === "function") {
            return beautifyHtml(source, options);
          }
          if (type === "css" && typeof beautifyCss === "function") {
            return beautifyCss(source, options);
          }
          if (type === "js" && typeof beautifyJs === "function") {
            return beautifyJs(source, options);
          }
          return source;
        } catch {
          return source;
        }
      };

      const initialHtml = formatByType(ed.getHtml() || "", "html");
      const initialCss = formatByType(ed.getCss() || "", "css");
      const initialJs = formatByType(jsRef.current || "", "js");

        const wrapper = document.createElement("div");
        wrapper.style.display = "grid";
        wrapper.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
        wrapper.style.gap = "12px";
        wrapper.style.minHeight = "320px";
        wrapper.style.width = "100%";

        const htmlCol = document.createElement("div");
        const cssCol = document.createElement("div");
        const jsCol = document.createElement("div");
        htmlCol.style.minWidth = "0";
        cssCol.style.minWidth = "0";
        jsCol.style.minWidth = "0";

        const htmlLabel = document.createElement("div");
        htmlLabel.textContent = "HTML";
        htmlLabel.style.fontWeight = "600";
        htmlLabel.style.marginBottom = "6px";
        htmlLabel.style.color = "#f3f4f6";

        const cssLabel = document.createElement("div");
        cssLabel.textContent = "CSS";
        cssLabel.style.fontWeight = "600";
        cssLabel.style.marginBottom = "6px";
        cssLabel.style.color = "#f3f4f6";

        const jsLabel = document.createElement("div");
        jsLabel.textContent = "JS";
        jsLabel.style.fontWeight = "600";
        jsLabel.style.marginBottom = "6px";
        jsLabel.style.color = "#f3f4f6";

        const htmlInput = document.createElement("textarea");
        htmlInput.value = initialHtml;
        htmlInput.style.width = "100%";
        htmlInput.style.height = "300px";
        htmlInput.style.minHeight = "220px";
        htmlInput.style.resize = "vertical";
        htmlInput.style.fontFamily = "monospace";
        htmlInput.style.fontSize = "13px";
        htmlInput.style.padding = "10px";
        htmlInput.style.background = "#111827";
        htmlInput.style.color = "#e5e7eb";
        htmlInput.style.border = "1px solid #374151";
        htmlInput.style.borderRadius = "6px";
        htmlInput.style.caretColor = "#93c5fd";

        const cssInput = document.createElement("textarea");
        cssInput.value = initialCss;
        cssInput.style.width = "100%";
        cssInput.style.height = "300px";
        cssInput.style.minHeight = "220px";
        cssInput.style.resize = "vertical";
        cssInput.style.fontFamily = "monospace";
        cssInput.style.fontSize = "13px";
        cssInput.style.padding = "10px";
        cssInput.style.background = "#111827";
        cssInput.style.color = "#e5e7eb";
        cssInput.style.border = "1px solid #374151";
        cssInput.style.borderRadius = "6px";
        cssInput.style.caretColor = "#93c5fd";

        const jsInput = document.createElement("textarea");
        jsInput.value = initialJs;
        jsInput.style.width = "100%";
        jsInput.style.height = "300px";
        jsInput.style.minHeight = "220px";
        jsInput.style.resize = "vertical";
        jsInput.style.fontFamily = "monospace";
        jsInput.style.fontSize = "13px";
        jsInput.style.padding = "10px";
        jsInput.style.background = "#111827";
        jsInput.style.color = "#e5e7eb";
        jsInput.style.border = "1px solid #374151";
        jsInput.style.borderRadius = "6px";
        jsInput.style.caretColor = "#93c5fd";

        htmlCol.appendChild(htmlLabel);
        htmlCol.appendChild(htmlInput);
        cssCol.appendChild(cssLabel);
        cssCol.appendChild(cssInput);
        jsCol.appendChild(jsLabel);
        jsCol.appendChild(jsInput);

        wrapper.appendChild(htmlCol);
        wrapper.appendChild(cssCol);
        wrapper.appendChild(jsCol);

        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        footer.style.gap = "8px";
        footer.style.marginTop = "12px";
        footer.style.paddingTop = "10px";
        footer.style.borderTop = "1px solid rgba(255,255,255,0.15)";
        footer.style.background = "#1f1f1f";
        footer.style.zIndex = "2";

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.padding = "8px 14px";
        cancelBtn.style.border = "1px solid #5f6368";
        cancelBtn.style.background = "#2d2f33";
        cancelBtn.style.color = "#ffffff";
        cancelBtn.style.borderRadius = "4px";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.onclick = () => {
          resetCodeCommandState();
          modal.close();
        };

        const stretchBtn = document.createElement("button");
        stretchBtn.type = "button";
        stretchBtn.textContent = "Stretch";
        stretchBtn.style.padding = "8px 14px";
        stretchBtn.style.border = "1px solid #5f6368";
        stretchBtn.style.background = "#2d2f33";
        stretchBtn.style.color = "#ffffff";
        stretchBtn.style.borderRadius = "4px";
        stretchBtn.style.cursor = "pointer";

        const formatBtn = document.createElement("button");
        formatBtn.type = "button";
        formatBtn.textContent = "Format";
        formatBtn.style.padding = "8px 14px";
        formatBtn.style.border = "1px solid #5f6368";
        formatBtn.style.background = "#2d2f33";
        formatBtn.style.color = "#ffffff";
        formatBtn.style.borderRadius = "4px";
        formatBtn.style.cursor = "pointer";

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.textContent = "Save";
        saveBtn.style.padding = "8px 14px";
        saveBtn.style.border = "1px solid #1677ff";
        saveBtn.style.background = "#1677ff";
        saveBtn.style.color = "#ffffff";
        saveBtn.style.borderRadius = "4px";
        saveBtn.style.cursor = "pointer";

        let htmlEditor: any = null;
        let cssEditor: any = null;
        let jsEditor: any = null;

        const setEditorHeight = (height: number) => {
          htmlInput.style.height = `${height}px`;
          cssInput.style.height = `${height}px`;
          jsInput.style.height = `${height}px`;

          if (htmlEditor && cssEditor && jsEditor) {
            htmlEditor.setSize("100%", height);
            cssEditor.setSize("100%", height);
            jsEditor.setSize("100%", height);
            htmlEditor.refresh();
            cssEditor.refresh();
            jsEditor.refresh();
          }
        };

        const applyStretch = () => {
          const dialog = document.querySelector(".gjs-mdl-dialog") as HTMLElement | null;

          if (isStretched) {
            content.style.maxHeight = "92vh";
            wrapper.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
            stretchBtn.textContent = "Normal";
            if (dialog) {
              dialog.style.width = "96vw";
              dialog.style.maxWidth = "96vw";
            }
            const height = Math.max(420, Math.floor(window.innerHeight * 0.6));
            setEditorHeight(height);
          } else {
            content.style.maxHeight = "82vh";
            wrapper.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
            stretchBtn.textContent = "Stretch";
            if (dialog) {
              dialog.style.width = "";
              dialog.style.maxWidth = "";
            }
            setEditorHeight(baseEditorHeight);
          }
        };

        stretchBtn.onclick = () => {
          isStretched = !isStretched;
          applyStretch();
        };

        formatBtn.onclick = () => {
          const htmlValue = htmlEditor ? htmlEditor.getValue() : htmlInput.value || "";
          const cssValue = cssEditor ? cssEditor.getValue() : cssInput.value || "";
          const jsValue = jsEditor ? jsEditor.getValue() : jsInput.value || "";

          const prettyHtml = formatByType(htmlValue, "html");
          const prettyCss = formatByType(cssValue, "css");
          const prettyJs = formatByType(jsValue, "js");

          if (htmlEditor) htmlEditor.setValue(prettyHtml);
          else htmlInput.value = prettyHtml;

          if (cssEditor) cssEditor.setValue(prettyCss);
          else cssInput.value = prettyCss;

          if (jsEditor) jsEditor.setValue(prettyJs);
          else jsInput.value = prettyJs;
        };

        saveBtn.onclick = () => {
          const htmlValue = formatByType(
            htmlEditor ? htmlEditor.getValue() : htmlInput.value || "",
            "html"
          );
          const cssValue = formatByType(
            cssEditor ? cssEditor.getValue() : cssInput.value || "",
            "css"
          );
          const jsValue = formatByType(
            jsEditor ? jsEditor.getValue() : jsInput.value || "",
            "js"
          );

          jsRef.current = jsValue;
          ed.setComponents(htmlValue);
          ed.setStyle(cssValue);
          const next = buildContent(ed);
          if (next !== lastEmittedRef.current) {
            lastEmittedRef.current = next;
            onChange(next);
          }
          resetCodeCommandState();
          modal.close();
        };

        footer.appendChild(formatBtn);
        footer.appendChild(stretchBtn);
        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        const content = document.createElement("div");
        content.style.display = "flex";
        content.style.flexDirection = "column";
        content.style.maxHeight = "82vh";
        content.style.overflow = "auto";
        content.style.paddingBottom = "2px";
        content.style.background = "#1f1f1f";
        content.appendChild(wrapper);
        content.appendChild(footer);

        modal.setTitle("Code");
        modal.setContent(content);
        modal.open();

        const modalModel = modal.getModel?.();
        if (modalModel) {
          const onModalChange = () => {
            const isOpen = modalModel.get?.("open");
            if (!isOpen) {
              resetCodeCommandState();
              modalModel.off?.("change:open", onModalChange);
            }
          };
          modalModel.on?.("change:open", onModalChange);
        }

        requestAnimationFrame(() => {
          const editorOptions = {
            theme: "material-darker",
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 2,
            tabSize: 2,
          };

          htmlEditor = CodeMirror.fromTextArea(htmlInput, {
            ...editorOptions,
            mode: "htmlmixed",
          });
          cssEditor = CodeMirror.fromTextArea(cssInput, {
            ...editorOptions,
            mode: "css",
          });
          jsEditor = CodeMirror.fromTextArea(jsInput, {
            ...editorOptions,
            mode: "javascript",
          });

          htmlEditor.setSize("100%", baseEditorHeight);
          cssEditor.setSize("100%", baseEditorHeight);
          jsEditor.setSize("100%", baseEditorHeight);

          htmlEditor.getWrapperElement().style.borderRadius = "6px";
          cssEditor.getWrapperElement().style.borderRadius = "6px";
          jsEditor.getWrapperElement().style.borderRadius = "6px";

          htmlEditor.refresh();
          cssEditor.refresh();
          jsEditor.refresh();

          applyStretch();
        });
    };

    editor.Commands.add("cms:open-code", {
      run(ed: any) {
        openCodeModal(ed);
      },
      stop() {},
    });

    if (editor.Commands.has("core:open-code")) {
      editor.Commands.extend("core:open-code", {
        run(ed: any) {
          openCodeModal(ed);
        },
        stop() {},
      });
    } else {
      editor.Commands.add("core:open-code", {
        run(ed: any) {
          openCodeModal(ed);
        },
        stop() {},
      });
    }

    let isSidePanelHidden = false;
    let sidePanelWidth = 0;
    const applySidePanelVisibility = (hidden: boolean) => {
      const root = editor.getContainer() as HTMLElement;
      const viewsContainer = root.querySelector(".gjs-pn-views-container") as HTMLElement | null;
      const viewsPanel = root.querySelector(".gjs-pn-panel.gjs-pn-views") as HTMLElement | null;
      const canvas = root.querySelector(".gjs-cv-canvas") as HTMLElement | null;

      if (viewsContainer) {
        const measured = Math.round(viewsContainer.getBoundingClientRect().width);
        if (!sidePanelWidth && measured > 0) {
          sidePanelWidth = measured;
        }
        viewsContainer.style.transition = "width 220ms ease, opacity 180ms ease";
        viewsContainer.style.overflow = "hidden";
      }
      if (viewsPanel) {
        viewsPanel.style.transition = "opacity 180ms ease";
      }
      if (canvas) {
        canvas.style.transition = "right 220ms ease";
      }

      const expandedWidth = sidePanelWidth || 280;

      if (viewsContainer) {
        viewsContainer.style.width = hidden ? "0px" : `${expandedWidth}px`;
        viewsContainer.style.minWidth = hidden ? "0px" : `${expandedWidth}px`;
        viewsContainer.style.opacity = hidden ? "0" : "1";
        viewsContainer.style.pointerEvents = hidden ? "none" : "";
      }
      if (viewsPanel) {
        viewsPanel.style.opacity = hidden ? "0" : "1";
        viewsPanel.style.pointerEvents = hidden ? "none" : "";
      }
      if (canvas) {
        canvas.style.right = hidden ? "0px" : `${expandedWidth}px`;
      }
    };

    editor.Commands.add("cms:toggle-side-panel", {
      run(ed: any, sender: any) {
        isSidePanelHidden = !isSidePanelHidden;
        applySidePanelVisibility(isSidePanelHidden);
        if (sender?.set) {
          sender.set("active", isSidePanelHidden);
          sender.set("attributes", {
            ...(sender.get("attributes") || {}),
            title: isSidePanelHidden ? "Show Side Panel" : "Hide Side Panel",
          });
        }
      },
    });

    const panels = editor.Panels.getPanels();
    panels.forEach((panel: any) => {
      const buttons = panel.get("buttons");
      if (!buttons) return;
      buttons.forEach((btn: any) => {
        const cmd = btn.get("command");
        const id = btn.get("id");
        if (cmd === "core:open-code" || id === "open-code") {
          btn.set("command", "cms:open-code");
          btn.set("togglable", false);
          btn.set("active", false);
        }
      });
    });

    const optionsPanel = editor.Panels.getPanel("options");
    if (optionsPanel) {
      const optionsButtons = optionsPanel.get("buttons");
      const hasCustom = optionsButtons?.some((btn: any) => btn.get("id") === "cms-open-code");
      if (!hasCustom) {
        (optionsButtons as any)?.add({
          id: "cms-open-code",
          className: "fa fa-file-code-o",
          command: "cms:open-code",
          togglable: false,
          attributes: { title: "Edit Code" },
        } as any);
      }

      const hasToggleSide = optionsButtons?.some((btn: any) => btn.get("id") === "cms-toggle-side-panel");
      if (!hasToggleSide) {
        (optionsButtons as any)?.add({
          id: "cms-toggle-side-panel",
          className: "fa fa-columns",
          command: "cms:toggle-side-panel",
          togglable: false,
          attributes: { title: "Hide Side Panel" },
        } as any);
      }
    }

    const ensureUrlTraits = (component: any) => {
      if (!component) return;
      const tagName = String(component.get("tagName") || "").toLowerCase();

      if (tagName === "a") {
        component.set("traits", [
          {
            type: "text",
            name: "href",
            label: "URL",
            placeholder: "https://example.com",
          },
          {
            type: "select",
            name: "target",
            label: "Target",
            options: [
              { id: "", label: "Same tab" },
              { id: "_blank", label: "New tab" },
            ],
          },
          {
            type: "text",
            name: "rel",
            label: "Rel",
            placeholder: "noopener noreferrer",
          },
        ]);
      }

      if (tagName === "button") {
        component.set("traits", [
          {
            type: "text",
            name: "data-url",
            label: "URL",
            placeholder: "https://example.com",
          },
          {
            type: "select",
            name: "data-target",
            label: "Target",
            options: [
              { id: "", label: "Same tab" },
              { id: "_blank", label: "New tab" },
            ],
          },
        ]);
      }

      if (tagName === "video" || tagName === "iframe") {
        component.set("traits", [
          {
            type: "text",
            name: "src",
            label: "URL",
            placeholder: "https://...",
          },
          {
            type: "checkbox",
            name: "allowfullscreen",
            label: "Allow Fullscreen",
            valueTrue: "allowfullscreen",
            valueFalse: "",
          },
        ]);
      }
    };

    editor.on("component:selected", (component: any) => {
      ensureUrlTraits(component);

      const tagName = String(component?.get?.("tagName") || "").toLowerCase();
      if (["a", "button", "video", "iframe"].includes(tagName)) {
        const traitsBtn = editor.Panels.getButton("views", "open-tm");
        if (traitsBtn && !traitsBtn.get("active")) {
          traitsBtn.set("active", true);
        }
      }
    });

    editor.on("component:update:attributes:data-url", (component: any) => {
      const tagName = String(component?.get?.("tagName") || "").toLowerCase();
      if (tagName !== "button") return;

      const attrs = component.getAttributes?.() || {};
      const url = String(attrs["data-url"] || "").trim();
      if (!url) {
        const nextOnClick = String(attrs.onclick || "").replace(/window\.open\([^)]*\);?/g, "").replace(/window\.location\.href\s*=\s*[^;]+;?/g, "").trim();
        component.addAttributes({ onclick: nextOnClick });
        return;
      }

      const target = String(attrs["data-target"] || "").trim();
      const escaped = JSON.stringify(url);
      const onClick = target === "_blank"
        ? `window.open(${escaped}, '_blank');`
        : `window.location.href=${escaped};`;

      component.addAttributes({ onclick: onClick });
    });

    editor.on("component:update:attributes:data-target", (component: any) => {
      const tagName = String(component?.get?.("tagName") || "").toLowerCase();
      if (tagName !== "button") return;
      const attrs = component.getAttributes?.() || {};
      if (!attrs["data-url"]) return;
      const url = String(attrs["data-url"] || "").trim();
      const target = String(attrs["data-target"] || "").trim();
      const escaped = JSON.stringify(url);
      const onClick = target === "_blank"
        ? `window.open(${escaped}, '_blank');`
        : `window.location.href=${escaped};`;
      component.addAttributes({ onclick: onClick });
    });

    editorRef.current = editor;

    const emit = () => {
      const next = buildContent(editor);
      if (next !== lastEmittedRef.current) {
        lastEmittedRef.current = next;
        onChange(next);
      }
    };

    editor.on("update", emit);

    return () => {
      try {
        editor.off("update", emit);
        editor.destroy();
      } catch {
        // ignore destroy errors
      }
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const incoming = value || "";
    if (!incoming || incoming === lastEmittedRef.current) return;

    const { body, css, js } = extractContentParts(incoming);
    jsRef.current = js;
    editor.setComponents(body || "");
    editor.setStyle(css || "");
    lastEmittedRef.current = incoming;
  }, [value]);

  return <div ref={hostRef} />;
}

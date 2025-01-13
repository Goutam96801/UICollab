import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, CheckIcon, Clipboard } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";

const frameworks = [
  {
    id: "react",
    name: "React",
    icon: <img src="/logo192.png" className="w-4 h-4" />,
  },
  {
    id: "vue",
    name: "Vue",
    icon: <img src="/vue-vuejs.svg" className="w-4 h-4" />,
  },
  {
    id: "angular",
    name: "Angular",
    icon: <img src="/angular-com.svg" className="w-4 h-4" />,
  },
  {
    id: "svelte",
    name: "Svelte",
    icon: <img src="/svelte.svg" className="w-4 h-4" />,
  },
  {
    id: "lit",
    name: "Lit",
    icon: <img src="/lit-lits.svg" className="w-4 h-4" />,
  },
];

const convertToReact = (html, css) => {
  const formattedHtml = html.replace(/class=/g, "className=");
  return `import React from 'react';
import styled from 'styled-components';

const Component = () => {
  return (
    <StyledWrapper>
      ${formattedHtml}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div\`
  ${css}
\`;

export default Component;
`;
};

const convertToVue = (html, css) => {
  return `<template>
  ${html}
</template>

<script>
export default {
  name: 'Component',
  // Add any necessary component logic here
}
</script>

<style scoped>
${css}
</style>
`;
};

const convertToAngular = (html, css) => {
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: \`
    ${html}
  \`,
  styles: [\`
    ${css}
  \`]
})
export class AppComponent {
  // Add any necessary component logic here
}
`;
};

const convertToSvelte = (html, css) => {
  return `<script>
  // Add any necessary component logic here
</script>

${html}

<style>
${css}
</style>
`;
};

const convertToLit = (html, css) => {
  return `import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  static styles = css\`
    ${css}
  \`;

  render() {
    return html\`
      ${html}
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-component': MyComponent;
  }
}
`;
};

export default function CodeConverter({
  postData,
  exportModal,
  setExportModal,
}) {
  const [selectedFramework, setSelectedFramework] = useState(
    exportModal || "react"
  );
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHtml(postData.htmlCode);
    setCss(postData.cssCode);
  }, [postData]);

  const handleConvert = () => {
    let converted = "";
    let language = "javascript";
    switch (selectedFramework) {
      case "react":
        converted = convertToReact(html, css);
        language = "javascript";
        break;
      case "vue":
        converted = convertToVue(html, css);
        language = "html";
        break;
      case "angular":
        converted = convertToAngular(html, css);
        language = "typescript";
        break;
      case "svelte":
        converted = convertToSvelte(html, css);
        language = "html";
        break;
      case "lit":
        converted = convertToLit(html, css);
        language = "javascript";
        break;
    }
    setConvertedCode(converted);
    setEditorLanguage(language);
  };

  useEffect(() => {
    handleConvert();
  }, [selectedFramework, html, css]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setExportModal("");
  };

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      readOnly: true,
      fontSize: 16,
      wordWrap: "on",
    }),
    []
  );

  return (
    <div className="fixed inset-0 z-50 authentication-bg flex overflow-hidden items-start justify-center p-2 sm:px-6 md:px-8 bg-[#212121]/80 ">
      <div className="relative w-full h-[calc(100vh-20px)]  max-w-4xl bg-zinc-950 rounded-lg shadow-md ring-1 ring-zinc-800 overflow-hidden
      ">
        <div className="px-4 py-2">
          <div className="pr-8 h-12">
            {selectedFramework === "react" && (
              <h1 className="text-sm text-left">
                This snippet is using <a href="https://styled-components.com/?ref=Uicollab.io" target="_blank" className="underline text-teal-500">styled-components</a>. Install it with <span className="bg-[#3a3a3a] px-1 py-0.5 rounded-md">npm i
                styled-components</span> or <span className="bg-[#3a3a3a] px-1 py-0.5 rounded-md">yarn add styled-components</span>, or copy the
                styles to your own CSS file for this code to work.
              </h1>
            )}
          </div>
          {/* Framework tabs */}
          <div className="flex border-b border-zinc-800">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setSelectedFramework(framework.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors relative
                ${
                  selectedFramework === framework.id
                    ? "text-white bg-zinc-800/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                }`}
              >
                <span>{framework.icon}</span>
                {framework.name}
                {selectedFramework === framework.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <button
              className="h-8 w-8 text-zinc-400 hover:text-white absolute right-5"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            {/* Editor */}

            <div className="w-full h-[calc(100vh-120px)] border border-[#212121] pt-2 rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
              <MonacoEditor
                height="100%"
                language={editorLanguage}
                theme="vs-dark"
                value={convertedCode}
                options={editorOptions}
                onChange={(value) => setConvertedCode(value || "")}
              />
              <button
                onClick={handleCopy}
                className=" flex gap-1 items-center absolute top-[60px] right-[24px]  py-0.5 text-sm w-[78px] justify-center rounded text-center bg-[#232323]/70 font-semibold"
              >
                <Clipboard width={15} />
                {copied ? (
                  <CheckIcon width={15} className="text-teal-400" />
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          </AnimatePresence>
        </div>
        <button
          onClick={handleCloseModal}
          className="absolute top-1 right-3 rounded-full hover:bg-[#212121] duration-300 p-1"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab, indentLess } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import {
  indentUnit,
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";

interface CodeEditorProps {
  className?: string;
  height?: string;
  onChange?: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  className = "",
  height = "100%",
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Compartment for dynamic configuration
  const themeCompartment = useRef(new Compartment());
  const tabSizeCompartment = useRef(new Compartment());

  // Default code content
  const defaultCode = `// This Pine Script® code

//@version=6
indicator("My script")
plot(close)`.trim();

  // Pine Script completions
  const pineScriptCompletions = useMemo(
    () => [
      { label: "indicator", type: "function" },
      { label: "strategy", type: "function" },
      { label: "plot", type: "function" },
      { label: "close", type: "variable" },
      { label: "open", type: "variable" },
      { label: "high", type: "variable" },
      { label: "low", type: "variable" },
      { label: "volume", type: "variable" },
      { label: "ta.sma", type: "function" },
      { label: "ta.ema", type: "function" },
      { label: "ta.rsi", type: "function" },
      { label: "ta.macd", type: "function" },
      { label: "strategy.entry", type: "function" },
      { label: "strategy.exit", type: "function" },
      { label: "strategy.close", type: "function" },
      { label: "math.max", type: "function" },
      { label: "math.min", type: "function" },
      { label: "array.new_float", type: "function" },
      { label: "array.push", type: "function" },
      { label: "if", type: "keyword" },
      { label: "else", type: "keyword" },
      { label: "for", type: "keyword" },
      { label: "while", type: "keyword" },
      { label: "var", type: "keyword" },
      { label: "varip", type: "keyword" },
    ],
    [],
  );

  // Custom syntax highlighting
  const customHighlighting = useMemo(
    () =>
      HighlightStyle.define([
        { tag: tags.keyword, color: "#ff79c6" },
        { tag: tags.string, color: "#f1fa8c" },
        { tag: tags.comment, color: "#6272a4" },
        { tag: tags.number, color: "#bd93f9" },
        { tag: tags.function(tags.variableName), color: "#50fa7b" },
        { tag: tags.variableName, color: "#8be9fd" },
        { tag: tags.operator, color: "#ff79c6" },
        { tag: tags.bracket, color: "#f8f8f2" },
      ]),
    [],
  );

  // Load content from localStorage
  const loadContent = useCallback(() => {
    try {
      const saved = localStorage.getItem("code-editor-content");
      return saved || defaultCode;
    } catch (error) {
      console.warn("Failed to load code from localStorage:", error);
      return defaultCode;
    }
  }, [defaultCode]);

  // Save content to localStorage
  const saveContent = useCallback((content: string) => {
    try {
      localStorage.setItem("code-editor-content", content);
    } catch (error) {
      console.warn("Failed to save code to localStorage:", error);
    }
  }, []);

  // Handle keyboard shortcuts
  const handleSave = useCallback(() => {
    if (viewRef.current) {
      const content = viewRef.current.state.doc.toString();
      saveContent(content);
      console.log("Code saved to localStorage");
    }
  }, [saveContent]);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const startState = EditorState.create({
      doc: loadContent(),
      extensions: [
        // Language support
        javascript({ typescript: true }),

        // Syntax highlighting
        syntaxHighlighting(customHighlighting),

        // Theme - Custom dark theme to match charts page
        themeCompartment.current.of(
          EditorView.theme(
            {
              "&": {
                backgroundColor: "hsl(0, 0%, 11%)",
                color: "hsl(0, 0%, 95%)",
              },
              ".cm-content": {
                backgroundColor: "hsl(0, 0%, 11%)",
                caretColor: "hsl(0, 0%, 95%)",
              },
              ".cm-editor": {
                backgroundColor: "hsl(0, 0%, 11%)",
              },
              ".cm-editor.cm-focused": {
                backgroundColor: "hsl(0, 0%, 11%)",
              },
              ".cm-scroller": {
                backgroundColor: "hsl(0, 0%, 11%)",
                scrollbarWidth: "none",
                "-ms-overflow-style": "none",
              },
              ".cm-scroller::-webkit-scrollbar": {
                display: "none",
              },
              ".cm-gutters": {
                backgroundColor: "hsl(0, 0%, 11%)",
                borderRight: "1px solid hsl(0, 0%, 20.4%)",
              },
              ".cm-lineNumbers .cm-gutterElement": {
                color: "hsl(0, 0%, 49%)",
              },
              ".cm-activeLine": {
                backgroundColor: "hsl(0, 0%, 15%)",
              },
              ".cm-activeLineGutter": {
                backgroundColor: "hsl(0, 0%, 15%)",
              },
            },
            { dark: true },
          ),
        ),

        // Editor features
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            height: height,
            fontSize: "12px",
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
          },
          ".cm-editor": {
            height: "100%",
            outline: "none",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-content": {
            padding: "8px 0",
          },
          ".cm-line": {
            padding: "0 8px",
          },
        }),

        // Tab size and indentation
        tabSizeCompartment.current.of(indentUnit.of("  ")),

        // Line numbers
        lineNumbers(),
        EditorView.lineWrapping,

        // Autocompletion
        autocompletion({
          activateOnTyping: true,
          maxRenderedOptions: 10,
          override: [
            (context) => {
              const word = context.matchBefore(/\w*/);
              if (!word || (word.from === word.to && !context.explicit))
                return null;
              return {
                from: word.from,
                options: pineScriptCompletions.map((item) => ({
                  label: item.label,
                  type: item.type,
                })),
              };
            },
          ],
        }),

        // Keyboard shortcuts
        keymap.of([
          {
            key: "Ctrl-s",
            run: () => {
              handleSave();
              return true;
            },
            preventDefault: true,
          },
          {
            key: "Cmd-s",
            run: () => {
              handleSave();
              return true;
            },
            preventDefault: true,
          },
          indentWithTab,
          {
            key: "Shift-Tab",
            run: indentLess,
          },
        ]),

        // Change listener
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),

        // Auto-save on changes (debounced)
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            // Debounce auto-save
            const timeoutId = setTimeout(() => {
              const content = update.state.doc.toString();
              saveContent(content);
            }, 1000);

            return () => clearTimeout(timeoutId);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;
    setIsLoaded(true);

    // Cleanup function
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [
    loadContent,
    saveContent,
    handleSave,
    height,
    onChange,
    customHighlighting,
    pineScriptCompletions,
  ]);

  // Handle resize
  useEffect(() => {
    if (viewRef.current && isLoaded) {
      // Force a re-measure when height changes
      setTimeout(() => {
        viewRef.current?.requestMeasure();
      }, 0);
    }
  }, [height, isLoaded]);

  // Handle theme changes if needed
  useEffect(() => {
    if (viewRef.current && isLoaded) {
      // Reconfigure theme if needed
      viewRef.current.dispatch({
        effects: themeCompartment.current.reconfigure(oneDark),
      });
    }
  }, [isLoaded]);

  return (
    <div
      ref={editorRef}
      className={`w-full overflow-hidden bg-background ${className}`}
      style={{ height }}
    />
  );
};

export default CodeEditor;

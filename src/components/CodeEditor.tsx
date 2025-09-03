"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab, indentLess } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import { indentUnit } from "@codemirror/language";

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
  const defaultCode = `// Your trading strategy code here

// Example: Simple Moving Average Crossover Strategy
function onTick(data) {
  const fastMA = calculateSMA(data.close, 9);
  const slowMA = calculateSMA(data.close, 21);

  if (fastMA > slowMA && !isPositionOpen()) {
    // Buy signal
    openPosition('BUY', 0.01);
  } else if (fastMA < slowMA && isPositionOpen()) {
    // Sell signal
    closePosition();
  }
}

function calculateSMA(prices, period) {
  if (prices.length < period) return 0;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

function isPositionOpen() {
  // Implement position checking logic
  return false;
}

function openPosition(direction, size) {
  // Implement position opening logic
  console.log(\`Opening \${direction} position with size \${size}\`);
}

function closePosition() {
  // Implement position closing logic
  console.log('Closing position');
}`.trim();

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

        // Theme
        themeCompartment.current.of(oneDark),

        // Editor features
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            height: height,
            fontSize: "14px",
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
        EditorView.lineWrapping,
        // Note: Line numbers are enabled by default in oneDark theme

        // Autocompletion
        autocompletion({
          activateOnTyping: true,
          maxRenderedOptions: 10,
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
  }, [loadContent, saveContent, handleSave, height, onChange]);

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
      className={`w-full overflow-hidden rounded-md border border-border bg-background ${className}`}
      style={{ height }}
    />
  );
};

export default CodeEditor;

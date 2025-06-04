import {
  NodeKey,
  LexicalEditor,
  LexicalCommand,
  RangeSelection,
  NodeSelection,
  DecoratorNode,
} from "lexical";
import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
  createCommand,
} from "lexical";

import * as React from "react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import ImageResizer from "../ui/ImageResizer";
import { $isImageNode } from "./ImageNode";
import { mergeRegister } from "@lexical/utils";
import Image from 'next/image';
import { MutableRefObject } from 'react';

// Cache para las imágenes
const imageCache = new Set<string>();

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
  createCommand("RIGHT_CLICK_IMAGE_COMMAND");

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    if (typeof window === 'undefined' || typeof window.Image === 'undefined') {
      // On SSR, just skip preloading
      return;
    }
    throw new Promise((resolve) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
      img.onerror = () => {
        imageCache.add(src);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
}: {
  altText: string;
  className: string | null;
  height: "inherit" | number;
  imageRef: MutableRefObject<HTMLImageElement | null>;
  maxWidth: number;
  src: string;
  width: "inherit" | number;
}): JSX.Element {
  useSuspenseImage(src);

  // Si es base64, usa <img>
  if (src.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imageRef}
        className={className || undefined}
        src={src}
        alt={altText || 'Imagen'}
        style={{
          maxWidth,
          objectFit: 'cover',
          width: width === 'inherit' ? '100%' : width,
          height: height === 'inherit' ? 'auto' : height,
        }}
      />
    );
  }

  // Si es URL normal, usa <Image />
  return (
    <div className="relative" style={{ width: width === 'inherit' ? '100%' : width, height: height === 'inherit' ? 'auto' : height }}>
      <Image
        className={className || undefined}
        src={src}
        alt={altText || 'Imagen'}
        ref={imageRef as MutableRefObject<HTMLImageElement>}
        fill
        style={{
          maxWidth,
          objectFit: 'cover'
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  captionsEnabled,
}: {
  altText: string;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
  src: string;
  width: "inherit" | number;
  resizable: boolean;
  showCaption: boolean;
  caption: LexicalEditor;
  captionsEnabled: boolean;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [selection, setSelection] = useState<null | RangeSelection | NodeSelection>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  
  const isFocused = isSelected;
  const draggable = isSelected && selection && $isNodeSelection(selection);

  const setShowCaptionFn = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  }, [editor, nodeKey]);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      editor.update(() => {
        const deleteSelection = $getSelection();
        if (isSelected && $isNodeSelection(deleteSelection)) {
          const event: KeyboardEvent = payload;
          event.preventDefault();
          deleteSelection.getNodes().forEach((node) => {
            if ($isImageNode(node)) {
              node.remove();
            }
          });
        }
      });
      return false;
    },
    [editor, isSelected]
  );


  const onEscape = useCallback(
    (event: KeyboardEvent): boolean => {  // Add explicit return type
      editor.update(() => {
        if (
          activeEditorRef.current === caption ||
          buttonRef.current === event.target
        ) {
          $setSelection(null);
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
          return true;
        }
        return false;
      });
      return false;  // Add explicit return for the outer function
    },
    [caption, editor, setSelected]
  );


  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection();
        const domElement = event.target as HTMLElement;
        if (
          domElement.tagName === "IMG" &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(
            RIGHT_CLICK_IMAGE_COMMAND,
            event as MouseEvent
          );
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    console.log('Estado actual:', {
      isSelected,
      isFocused,
      draggable,
      selection
    });
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const updatedSelection = $getSelection();
          if ($isRangeSelection(updatedSelection) || $isNodeSelection(updatedSelection)) {
            setSelection(updatedSelection);
          } else {
            setSelection(null);
          }
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          if (isResizing) {
            return true;
          }
          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_LOW
      )
    );

    rootElement?.addEventListener("contextmenu", onRightClick);

    return () => {
      unregister();
      rootElement?.removeEventListener("contextmenu", onRightClick);
    };
  }, [
    clearSelection,
    draggable,
    editor,
    isFocused,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    onEscape,
    onRightClick,
    selection,
    setSelected,
  ]);

  const onResizeEnd = useCallback(
    (nextWidth: "inherit" | number, nextHeight: "inherit" | number) => {
      setTimeout(() => {
        setIsResizing(false);
      }, 200);

      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setWidthAndHeight(nextWidth, nextHeight);
        }
      });
    },
    [editor, nodeKey]
  );

  const onResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  return (
    <Suspense fallback={null}>
      <>
        <div 
          draggable={draggable || false} 
          style={{ 
            position: 'relative',
            display: 'inline-block',
            width: 'fit-content'
          }}
        >
          <LazyImage
            className={
              isFocused
                ? `focused ${draggable ? "draggable" : ""}`
                : null
            }
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
          {resizable && isFocused && (
            <ImageResizer
              showCaption={showCaption}
              setShowCaption={setShowCaptionFn}
              editor={editor}
              buttonRef={buttonRef}
              imageRef={imageRef}
              maxWidth={maxWidth}
              onResizeStart={onResizeStart}
              onResizeEnd={onResizeEnd}
              captionsEnabled={captionsEnabled}
            />
          )}
        </div>
      </>
    </Suspense>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __maxWidth: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__maxWidth, node.getKey());
  }

  constructor(src: string, altText: string, maxWidth: number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
  }

  // ... existing code ...
}

export function $createImageNode(src: string, altText: string, maxWidth: number): ImageNode {
  return new ImageNode(src, altText, maxWidth);
}

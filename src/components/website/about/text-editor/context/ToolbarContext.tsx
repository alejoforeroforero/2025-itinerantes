/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ToolbarContextType } from "./toolbar.types";
import { INITIAL_TOOLBAR_STATE, blockTypeToBlockName, rootTypeToRootName } from "./toolbar.constants";
import { ElementFormatType } from "lexical";

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;

export type ToolbarState = {
  bgColor: string;
  blockType: keyof typeof blockTypeToBlockName;
  canRedo: boolean;
  canUndo: boolean;
  codeLanguage: string;
  elementFormat: ElementFormatType;
  fontColor: string;
  fontFamily: string;
  fontSize: string;
  fontSizeInputValue: string;
  isBold: boolean;
  isCode: boolean;
  isHighlight: boolean;
  isImageCaption: boolean;
  isItalic: boolean;
  isLink: boolean;
  isRTL: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
  isLowercase: boolean;
  isUppercase: boolean;
  isCapitalize: boolean;
  rootType: keyof typeof rootTypeToRootName;
  isLinkEditMode: boolean;
};

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [toolbarState, setToolbarState] = useState<ToolbarState>({
    ...INITIAL_TOOLBAR_STATE,
    isLinkEditMode: false,
  });

  const updateToolbarState = useCallback(<Key extends keyof typeof toolbarState>(
    key: Key,
    value: typeof toolbarState[Key]
  ) => {
    setToolbarState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      toolbarState,
      updateToolbarState,
    }),
    [toolbarState, updateToolbarState]
  );

  return (
    <ToolbarContext.Provider value={contextValue}>
      {children}
    </ToolbarContext.Provider>
  );
};

export const useToolbarState = () => {
  const context = useContext(ToolbarContext);

  if (!context) {
    throw new Error("useToolbarState must be used within a ToolbarProvider");
  }

  return context;
};

// Re-export constants and types that might be needed by consumers
export * from "./toolbar.constants";
export * from "./toolbar.types";

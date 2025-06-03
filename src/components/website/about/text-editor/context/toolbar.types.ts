import { ElementFormatType } from "lexical";
import { blockTypeToBlockName, rootTypeToRootName } from "./toolbar.constants";

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
};

export type ToolbarStateKey = keyof ToolbarState;
export type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key];

export type ToolbarContextType = {
  toolbarState: ToolbarState;
  updateToolbarState<Key extends ToolbarStateKey>(
    key: Key,
    value: ToolbarStateValue<Key>
  ): void;
};

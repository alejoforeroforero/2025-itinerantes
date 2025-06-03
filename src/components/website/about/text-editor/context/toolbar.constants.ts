export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;

export const rootTypeToRootName = {
  root: "Root",
  table: "Table",
} as const;

export const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
} as const;

export const INITIAL_TOOLBAR_STATE = {
  bgColor: "#fff",
  blockType: "paragraph",
  canRedo: false,
  canUndo: false,
  codeLanguage: "",
  elementFormat: "left",
  fontColor: "#000",
  fontFamily: "Arial",
  fontSize: `${DEFAULT_FONT_SIZE}px`,
  fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
  isBold: false,
  isCode: false,
  isHighlight: false,
  isImageCaption: false,
  isItalic: false,
  isLink: false,
  isRTL: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isUnderline: false,
  isLowercase: false,
  isUppercase: false,
  isCapitalize: false,
  rootType: "root",
} as const;
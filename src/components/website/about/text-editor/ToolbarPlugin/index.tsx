import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useToolbarState } from "../context/ToolbarContext";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSelectedNode } from "../../text-editor/utils/getSelectedNode";
import { UndoButton } from "./components/UndoButton";
import { RedoButton } from "./components/RedoButton";
import { BoldButton } from "./components/BoldButton";
import { ItalicButton } from "./components/ItalicButton";
import { UnderlineButton } from "./components/UnderlineButton";
import { StrikeThroughButton } from "./components/StrikeThroughButton";
import { LinkButton } from "./components/LinkButton";
import FontSize from "./components/fontSize";
import FontDropDown from "./components/FontDropDown";


import BlockFormatDropDown from "./components/BlockFormatDropDown";
import ElementFormatDropdown from "./components/ElementFormatDropdown";
import Divider from "../ui/General/Divider";
import { FontColorPicker } from "./components/FontColorPicker";
import { BackgroundColorPicker } from "./components/BackgroundColorPicker";
import { InsertDropDown } from "./components/InsertDropDown";

import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isListNode } from "@lexical/list";
import { $isLinkNode } from "@lexical/link";

import { mergeRegister, $findMatchingParent } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  $isElementNode,
} from "lexical";
// import { UserButton } from "./components/UserButton";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [, setIsLinkEditMode] = useState(false);
  const { toolbarState, updateToolbarState } = useToolbarState();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      // Get the parent node of the selection
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElement();

      if (element !== null) {
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);

        if (elementDOM !== null) {
          // Determine the block type
          let blockType = "paragraph";

          if ($isHeadingNode(element)) {
            const tag = element.getTag();
            blockType = tag; // h1, h2, h3
          } else if ($isListNode(element)) {
            const listType = element.getListType();
            blockType = listType; // bullet, number, check
          } else if ($isQuoteNode(element)) {
            blockType = "quote";
          }

          //Update the toolbar state with the new block type
          updateToolbarState(
            "blockType",
            blockType as
              | "paragraph"
              | "h1"
              | "h2"
              | "h3"
              | "bullet"
              | "quote"
              | "code"
              | "number"
              | "check"
          );
        }
      }
    }

    const node = $isRangeSelection(selection)
      ? getSelectedNode(selection)
      : null;
    const parent = node?.getParent();

    let matchingParent;
    if ($isLinkNode(parent) && node !== null) {
      matchingParent = $findMatchingParent(
        node,
        (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
      );
    }

    updateToolbarState(
      "elementFormat",
      $isElementNode(matchingParent)
        ? matchingParent.getFormatType()
        : $isElementNode(node)
        ? node.getFormatType()
        : parent?.getFormatType() || "left"
    );
  }, [editor, updateToolbarState]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <UndoButton />
      <RedoButton />
      <Divider />
      <BlockFormatDropDown
        disabled={!isEditable}
        blockType={toolbarState.blockType}
        rootType={toolbarState.rootType}
        editor={editor}
      />
      <Divider />
      <FontDropDown
        disabled={!isEditable}
        style={"font-family"}
        value={toolbarState.fontFamily}
        editor={editor}
      />
      <Divider />
      <FontSize
        selectionFontSize={toolbarState.fontSize}
        disabled={!isEditable}
        editor={editor}
      />
      <Divider />
      <BoldButton />
      <ItalicButton />
      <UnderlineButton />
      <StrikeThroughButton />
      <LinkButton
        isEditable={isEditable}
        setIsLinkEditMode={setIsLinkEditMode}
      />

      {/* <UserButton /> */}
      <FontColorPicker disabled={!isEditable} color={toolbarState.fontColor} />
      <BackgroundColorPicker
        disabled={!isEditable}
        color={toolbarState.bgColor}
      />
      <Divider />
      <InsertDropDown editor={editor} isEditable={isEditable} />
      <ElementFormatDropdown
        disabled={!isEditable}
        value={toolbarState.elementFormat}
        editor={editor}
        isRTL={toolbarState.isRTL}
      />
    </div>
  );
}

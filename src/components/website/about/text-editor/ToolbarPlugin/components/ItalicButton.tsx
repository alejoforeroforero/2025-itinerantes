import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection } from "lexical";

const LowPriority = 1;

export const ItalicButton = () => {
  const [editor] = useLexicalComposerContext();
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsItalic(selection.hasFormat("italic"));
          }
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsItalic(selection.hasFormat("italic"));
          }
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  const handleClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [editor]);

  return (
    <button
      onClick={handleClick}
      className={"toolbar-item spaced " + (isItalic ? "active" : "")}
      aria-label="Format Italics"
    >
      <i className="format italic" />
    </button>
  );
};

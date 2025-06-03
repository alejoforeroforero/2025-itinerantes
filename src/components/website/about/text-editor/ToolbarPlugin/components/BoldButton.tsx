import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection } from "lexical";

const LowPriority = 1;

export const BoldButton = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
          }
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
          }
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  const handleClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }, [editor]);

  return (
    <button
      onClick={handleClick}
      className={"toolbar-item spaced " + (isBold ? "active" : "")}
      aria-label="Format Bold"
    >
      <i className="format bold" />
    </button>
  );
};

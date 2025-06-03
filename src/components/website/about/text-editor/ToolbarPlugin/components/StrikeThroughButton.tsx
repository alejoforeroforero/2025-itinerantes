import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection } from "lexical";

const LowPriority = 1;

export const StrikeThroughButton = () => {
  const [editor] = useLexicalComposerContext();
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsStrikethrough(selection.hasFormat("strikethrough"));
          }
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsStrikethrough(selection.hasFormat("strikethrough"));
          }
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  const handleClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  }, [editor]);

  return (
    <button
      onClick={handleClick}
      className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
      aria-label="Format Strikethrough"
    >
      <i className="format strikethrough" />
    </button>
  );
};

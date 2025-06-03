import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { $getSelection, $isRangeSelection } from "lexical";

const LowPriority = 1;

export const UnderlineButton = () => {
  const [editor] = useLexicalComposerContext();
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsUnderline(selection.hasFormat("underline"));
          }
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsUnderline(selection.hasFormat("underline"));
          }
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  const handleClick = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }, [editor]);

  return (
    <button
      onClick={handleClick}
      className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
      aria-label="Format Underline"
    >
      <i className="format underline" />
    </button>
  );
};

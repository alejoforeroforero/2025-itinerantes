import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { UNDO_COMMAND, CAN_UNDO_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";

const LowPriority = 1;

export const UndoButton = () => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  const handleClick = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  return (
    <button
      disabled={!canUndo}
      onClick={handleClick}
      className="toolbar-item spaced"
      aria-label="Undo"
    >
      <i className="format undo" />
    </button>
  );
};

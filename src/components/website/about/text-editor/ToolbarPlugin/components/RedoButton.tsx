import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, CAN_REDO_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";

const LowPriority = 1;

export const RedoButton = () => {
  const [editor] = useLexicalComposerContext();
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor]);

  const handleClick = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return (
    <button
      disabled={!canRedo}
      onClick={handleClick}
      className="toolbar-item"
      aria-label="Redo"
    >
      <i className="format redo" />
    </button>
  );
};

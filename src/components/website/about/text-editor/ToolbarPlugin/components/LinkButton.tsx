import { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useToolbarState } from "../../context/ToolbarContext";
import { sanitizeUrl } from "../../utils/url";

const SHORTCUTS = {
  INSERT_LINK: "⌘K"
};

interface LinkButtonProps {
  isEditable: boolean;
  setIsLinkEditMode: (isEdit: boolean) => void;
}

export const LinkButton = ({ isEditable, setIsLinkEditMode }: LinkButtonProps) => {
  const [editor] = useLexicalComposerContext();
  const { toolbarState } = useToolbarState();

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
      setIsLinkEditMode(true);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      setIsLinkEditMode(false);
    }
  }, [editor, setIsLinkEditMode, toolbarState.isLink]);

  return (
    <button
      disabled={!isEditable}
      onClick={insertLink}
      className={'toolbar-item spaced ' + (toolbarState.isLink ? 'active' : '')}
      aria-label="Insert link"
      title={`Insert link (${SHORTCUTS.INSERT_LINK})`}
      type="button"
    >
      <i className="format link" />
    </button>
  );
};


'use client';

import { useCallback } from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import DropdownColorPicker from '../../ui/DropdownColorPicker';

interface FontColorPickerProps {
  disabled: boolean;
  color: string;
}

export function FontColorPicker({ 
  disabled, 
  color
}: FontColorPickerProps) {
  const [editor] = useLexicalComposerContext();

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      editor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: "historic" } : {}
      );
    },
    [editor]
  );

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  return (
    <DropdownColorPicker
      disabled={disabled}
      buttonClassName="toolbar-item color-picker"
      buttonAriaLabel="Formatting text color"
      buttonIconClassName="icon font-color"
      color={color}
      onChange={onFontColorSelect}
      title="text color"
    />
  );
}


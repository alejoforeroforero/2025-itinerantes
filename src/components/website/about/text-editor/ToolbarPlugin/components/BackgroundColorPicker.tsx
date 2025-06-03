'use client';

import { useCallback } from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import DropdownColorPicker from '../../ui/DropdownColorPicker';

interface BackgroundColorPickerProps {
  disabled: boolean;
  color: string;
}

export function BackgroundColorPicker({ 
  disabled, 
  color
}: BackgroundColorPickerProps) {
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

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({'background-color': value}, skipHistoryStack);
    },
    [applyStyleText]
  );

  return (
    <DropdownColorPicker
      disabled={disabled}
      buttonClassName="toolbar-item color-picker"
      buttonAriaLabel="Formatting background color"
      buttonIconClassName="icon bg-color"
      color={color}
      onChange={onBgColorSelect}
      title="background color"
    />
  );
}
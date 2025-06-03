'use client';

import { LexicalEditor } from 'lexical';
import { $getSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { JSX, useCallback } from 'react';
import DropDown, { DropDownItem } from '../../ui/DropDown/DropDown';

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

interface FontDropDownProps {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}

export default function FontDropDown({
  editor,
  value,
  style,
  disabled = false,
}: FontDropDownProps): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel = 'Formatting text font family';

  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item font-family"
      buttonLabel={value}
      buttonIconClassName="icon font-family"
      buttonAriaLabel={buttonAriaLabel}
    >
      {FONT_FAMILY_OPTIONS.map(([option, text]) => (
        <DropDownItem
          key={option}
          className={'item ' + (value === option ? 'active' : '')}
          onClick={() => handleClick(option)}
        >
          <span className="text" style={{ fontFamily: option }}>
            {text}
          </span>
        </DropDownItem>
      ))}
    </DropDown>
  );
}
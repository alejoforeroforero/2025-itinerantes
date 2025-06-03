/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use client';

import './fontSize.css';

import {LexicalEditor} from 'lexical';
import * as React from 'react';
import {useEffect, useState} from 'react';

import {
  MAX_ALLOWED_FONT_SIZE,
  MIN_ALLOWED_FONT_SIZE,
  DEFAULT_FONT_SIZE,
} from '../../context/ToolbarContext';
import {updateFontSizeInSelection} from '../utils';

export default function FontSize({
  selectionFontSize,
  disabled,
  editor,
}: {
  selectionFontSize: string;
  disabled: boolean;
  editor: LexicalEditor;
}) {
  // Inicializamos con el valor por defecto convertido a string
  const [inputValue, setInputValue] = useState<string>(String(DEFAULT_FONT_SIZE));

  const handleInputChange = (value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    let finalValue = numValue;
    if (numValue > MAX_ALLOWED_FONT_SIZE) {
      finalValue = MAX_ALLOWED_FONT_SIZE;
    } else if (numValue < MIN_ALLOWED_FONT_SIZE) {
      finalValue = MIN_ALLOWED_FONT_SIZE;
    }

    setInputValue(String(finalValue));
    updateFontSizeInSelection(editor, `${finalValue}px`, null);
  };

  const handleIncrement = () => {
    const currentValue = Number(inputValue) || DEFAULT_FONT_SIZE;
    const newValue = Math.min(currentValue + 1, MAX_ALLOWED_FONT_SIZE);
    handleInputChange(String(newValue));
  };

  const handleDecrement = () => {
    const currentValue = Number(inputValue) || DEFAULT_FONT_SIZE;
    const newValue = Math.max(currentValue - 1, MIN_ALLOWED_FONT_SIZE);
    handleInputChange(String(newValue));
  };

  useEffect(() => {
    // Si hay un valor de selección, lo usamos, si no, mantenemos el valor por defecto
    if (selectionFontSize) {
      const fontSize = selectionFontSize.replace('px', '');
      setInputValue(fontSize);
    }
  }, [selectionFontSize]);

  return (
    <>
      <button
        type="button"
        disabled={disabled || Number(inputValue) <= MIN_ALLOWED_FONT_SIZE}
        onClick={handleDecrement}
        className="toolbar-item font-decrement"
        aria-label="Decrease font size">
        <i className="format minus-icon" />
      </button>

      <input
        type="number"
        title="Font size"
        value={inputValue}
        disabled={disabled}
        className="toolbar-item font-size-input"
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onChange={(e) => handleInputChange(e.target.value)}
      />

      <button
        type="button"
        disabled={disabled || Number(inputValue) >= MAX_ALLOWED_FONT_SIZE}
        onClick={handleIncrement}
        className="toolbar-item font-increment"
        aria-label="Increase font size">
        <i className="format add-icon" />
      </button>
    </>
  );
}

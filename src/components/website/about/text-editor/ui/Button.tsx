/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import './Button.css';

import * as React from 'react';
import {ReactNode} from 'react';



export default function Button({
  'data-test-id': dataTestId,
  children,
  className = 'Button__root',
  onClick,
  disabled,
  title,
}: {
  'data-test-id'?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
}): JSX.Element {
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && {'data-test-id': dataTestId})}>
      {children}
    </button>
  );
}

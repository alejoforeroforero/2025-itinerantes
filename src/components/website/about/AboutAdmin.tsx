"use client";

import { TextEditor } from "./text-editor/TextEditor";

interface AboutAdminProps {
  title: string;
  content: string;
}

export const AboutAdmin = ({ content }: AboutAdminProps) => {
  return (
    <div className="p-4">
      <TextEditor initialContent={content} />
    </div>
  );
};

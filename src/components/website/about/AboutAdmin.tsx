"use client";


import { TextEditor } from "./text-editor/TextEditor";

interface AboutAdminProps {
  title: string;
  content: string;
}

export const AboutAdmin = ({ title, content }: AboutAdminProps) => {
  console.log(title);
  return (
    <div className="p-4">
      <TextEditor initialContent={content} />
    </div>
  );
};

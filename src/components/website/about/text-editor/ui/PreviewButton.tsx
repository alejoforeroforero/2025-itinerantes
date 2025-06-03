"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { JSX, useState } from "react";
import { convertToHTMLDynamic } from "../utils/convertToHTMLDynamic";
import { createPortal } from "react-dom";
import { updateAbout } from "@/actions/about-actions";

export const PreviewButton = () => {
  const [editor] = useLexicalComposerContext();
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<JSX.Element | null>(
    null
  );
  const [title, setTitle] = useState(""); // Add title state

  const handleClick = async () => {
    const editorState = editor.getEditorState();
    const json = editorState.toJSON();
    const jsonText = JSON.stringify(json);

    const result = await updateAbout(title, jsonText);

    console.log(result);

    const content = convertToHTMLDynamic(jsonText);

    setPreviewContent(content);
    setShowPreview(true);
  };

  const handleOnClose = () => {
    setShowPreview(false);
    setTitle(""); // Reset title when closing
  };

  const handleSave = async () => {
    try {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      const jsonText = JSON.stringify(json);

      const result = await updateAbout(title, jsonText);

      if (result.success) {
        handleOnClose();
      } else {
        // You might want to show an error message to the user here
        console.error("Error saving:", result.error);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="editor-preview-button cursor-pointer"
        aria-label="Preview content"
      >
        <i className="format preview" />
        <span className="text">Preview</span>
      </button>

      {showPreview &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
            <div className="bg-white p-4 rounded-md shadow-lg w-3/4 max-w-4xl flex flex-col max-h-[90vh]">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Preview
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                      disabled={!title.trim()}
                    >
                      <i className="format save" />
                      <span className="text">Save</span>
                    </button>
                    <button
                      onClick={handleOnClose}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md flex items-center transition-colors cursor-pointer"
                    >
                      <span className="text-xl font-medium">×</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 
                    bg-white text-gray-800 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <div className="mt-4 flex-1 overflow-auto bg-gray-50 rounded-md p-4">
                <div className="editor-container">
                  <div className="editor-inner">
                    <div className="editor-input text-gray-800">{previewContent}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

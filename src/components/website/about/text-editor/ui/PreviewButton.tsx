import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";
import { convertToHTMLDynamic } from "../utils/convertToHTMLDynamic";
import { createPortal } from "react-dom";
import { updateAboutContent } from '@/actions/about-actions';


export const PreviewButton = () => {
  const [editor] = useLexicalComposerContext();
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<React.JSX.Element | null>(null);

  const handleClick = () => {
    const editorState = editor.getEditorState();
    const json = editorState.toJSON();
    console.log('Preview JSON:', json); // Add this to debug
    const jsonText = JSON.stringify(json);  
    const content = convertToHTMLDynamic(jsonText);
    console.log('Generated content:', content); // Add this to debug
    setPreviewContent(content);
    setShowPreview(true);
  };

  const handleOnClose = () => {
    setShowPreview(false);
  };

  const handleSave = async () => {
    try {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      const jsonText = JSON.stringify(json);

      updateAboutContent(jsonText);
    
      setShowPreview(false);

    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="editor-preview-button"
        aria-label="Preview content"
      >
        <i className="format preview" />
        <span className="text">Preview</span>
      </button>

      {showPreview &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg w-3/4 max-w-4xl">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold dark:text-gray-200">
                    Preview
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    // Disable if title is empty
                    >
                      <i className="format save" />
                      <span className="text">Save</span>
                    </button>
                    <button
                      onClick={handleOnClose}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md flex items-center transition-colors"
                    >
                      <span className="text-xl font-medium">×</span>
                    </button>
                  </div>
                </div>               
                
              </div>
              
              <div className="editor-scroller overflow-auto max-h-[70vh] dark:text-gray-200 mt-4">
                <div className="editor-container">
                  <div className="editor-inner">
                    <div className="editor-input">
                      {previewContent}
                    </div>
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

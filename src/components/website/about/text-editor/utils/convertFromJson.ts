import { LexicalEditor, SerializedEditorState } from "lexical";


export const DEFAULT_CONTENT: SerializedEditorState = {
  root: {
    children: [
      {
        // @ts-expect-error internal field
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

export async function loadContent(
  editor: LexicalEditor,
  serializedContent: SerializedEditorState
) {
  const updatedContent = await rebuildJson(serializedContent);
  
  editor.update(() => {
    const state = editor.parseEditorState(JSON.stringify(updatedContent));
    editor.setEditorState(state);
  });
}

async function rebuildJson(serializedContent: SerializedEditorState) {
  // Traverse through all children recursively
  if (serializedContent.root?.children) {
    for (let i = 0; i < serializedContent.root.children.length; i++) {
      const node = serializedContent.root.children[i];
      console.log(node);
  
      
    }
  }
  return serializedContent;
}

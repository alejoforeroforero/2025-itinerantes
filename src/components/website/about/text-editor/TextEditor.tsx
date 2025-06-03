//Context

import { useState, useEffect } from 'react'
import { ToolbarProvider } from './context/ToolbarContext'

//Lexical Plugins
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

//Custom Plugins
// import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ToolbarPlugin from './ToolbarPlugin'
import LinkPlugin from './plugins/LinkPlugin'
import { CheckListPlugin } from './plugins/CheckListPlugin/LexicalCheckListPlugin'
import YouTubePlugin from './plugins/YouTubePlugin'
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin'
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin'



//import TreeViewPlugin from "./plugins/TreeViewPlugin/TreeViewPlugin";

import { PreviewButton } from './ui/PreviewButton'

//Lexical Nodes
import { editorNodes } from './nodes/LexicalNodes/LexicalNodes'

//Theme
import TextEditorTheme from './TextEditorTheme'

//Styles
//import "./Playground.css";
import './styles/Editor.css'
import './styles/Toolbar.css'
import './styles/Iconos.css'
import './styles/Dropdown.css'
import './ui/ImageResizer.css'

import { DEFAULT_CONTENT, loadContent } from './utils/convertFromJson'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import ImagesPlugin from './plugins/ImagesPlugin'


interface TextEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
}

const placeholder = 'Enter some rich text...'

const editorConfig = {
  namespace: 'Text Editor',
  nodes: editorNodes,
  onError(error: Error) {
    throw error
  },
  theme: TextEditorTheme,
}

export const TextEditor = ({ initialContent, onChange }: TextEditorProps) => {

  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  // Añadir un plugin para manejar los cambios
  const OnChangePlugin = ({ onChange }: { onChange?: (content: string) => void }) => {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        if (onChange) {
          // Convertir el estado del editor a JSON string
          onChange(JSON.stringify(editorState.toJSON()))
        }
      })
    }, [editor, onChange])

    return null
  }

  return (
    <ToolbarProvider>
      <LexicalComposer initialConfig={editorConfig}>
        <div className='editor-container'>
          <ToolbarPlugin />
          <div className='editor-inner'>
            <RichTextPlugin
              contentEditable={
                <div className='editor-scroller'>
                  <div className='editor' ref={onRef}>
                    <ContentEditable
                      className='editor-input'
                      aria-placeholder={placeholder}
                      placeholder={<div className='editor-placeholder'>{placeholder}</div>}
                    />
                    <PreviewButton />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <InitialContentPlugin initialContent={initialContent || JSON.stringify(DEFAULT_CONTENT)} />
            {/* Añadir el plugin de cambios */}
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ImagesPlugin />
       

            <LinkPlugin hasLinkAttributes={true} />
            {floatingAnchorElem && (
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            )}
            <AutoEmbedPlugin />
            {floatingAnchorElem && <DraggableBlockPlugin anchorElem={floatingAnchorElem} />}
            <YouTubePlugin />
          </div>
        </div>
      </LexicalComposer>
    </ToolbarProvider>
  )
}

// Create a new plugin to handle initial content
function InitialContentPlugin({ initialContent }: { initialContent: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    try {
      const content = typeof initialContent === 'string' ? JSON.parse(initialContent) : initialContent

      loadContent(editor, content)
    } catch (error) {
      console.error('Error loading initial content:', error)
      loadContent(editor, DEFAULT_CONTENT)
    }
  }, [editor, initialContent])

  return null
}

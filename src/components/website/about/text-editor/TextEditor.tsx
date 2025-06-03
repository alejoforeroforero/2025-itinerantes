//Context

import { useEffect } from 'react'
import { ToolbarProvider } from './context/ToolbarContext'

//Lexical Plugins
import ToolbarPlugin from './ToolbarPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { editorNodes } from './nodes/LexicalNodes/LexicalNodes'

import { PreviewButton } from './ui/PreviewButton'

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

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      //setFloatingAnchorElem(_floatingAnchorElem)
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
                  </div>
                  <PreviewButton />
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <InitialContentPlugin initialContent={initialContent || JSON.stringify(DEFAULT_CONTENT)} />
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />        
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

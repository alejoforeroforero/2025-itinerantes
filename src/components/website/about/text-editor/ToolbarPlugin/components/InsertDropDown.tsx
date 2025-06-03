import { LexicalEditor } from 'lexical'
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin'
import DropDown, { DropDownItem } from '../../../text-editor/ui/DropDown/DropDown'
import { EmbedConfigs } from '../../../text-editor/plugins/AutoEmbedPlugin'
// import useModal from '@/text-editor/hooks/useModal'
import useModal from '../../hooks/useModal'
import { InsertImageDialog } from '../../../text-editor/plugins/ImagesPlugin'


export const InsertDropDown = ({ editor, isEditable }: { editor: LexicalEditor; isEditable: boolean }) => {
  const [modal, showModal] = useModal()
  return (
    <>
      <DropDown
        disabled={!isEditable}
        buttonClassName='toolbar-item spaced'
        buttonLabel='Insert'
        buttonAriaLabel='Insert specialized editor node'
        buttonIconClassName='icon plus'
      >
        {EmbedConfigs.map((embedConfig) => (
          <DropDownItem
            key={embedConfig.type}
            onClick={() => {
              editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
            }}
            className='item'
          >
            {embedConfig.icon}
            <span className='text'>{embedConfig.contentName}</span>
          </DropDownItem>
        ))}
        <DropDownItem
          onClick={() => {
            showModal('Insert Image', (onClose) => <InsertImageDialog activeEditor={editor} onClose={onClose} />)
          }}
          className='item'
        >
          <i className='icon image' />
          <span className='text'>Image</span>
        </DropDownItem>
      </DropDown>
      {modal}
    </>
  )
}

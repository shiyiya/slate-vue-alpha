import { defineComponent, onMounted, onUpdated, PropType, ref as useRef, renderSlot } from 'vue'
import { Editor, Element as SlateElement, Node, Range } from 'slate'
import { direction as getDirection } from 'direction'
import {
  EDITOR_TO_KEY_TO_ELEMENT,
  ELEMENT_TO_NODE,
  NODE_TO_ELEMENT,
  NODE_TO_INDEX,
  NODE_TO_PARENT
} from '../utils/weak-maps'
import { Children } from './children'
import Text from './text'
import { useSlateStatic } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import { useReadOnly } from '../hooks/useReadOnly'
import useEffect from '../hooks/use-effect'

type ElementProps = {
  decorations: Range[]
  element: SlateElement
  selection: Range | null
  // renderLeaf?: (props: RenderLeafProps) => JSX.Element
  // renderElement?: (props: RenderElementProps) => JSX.Element
  // renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
}

const ElementProps = {
  decorations: Array as PropType<Range[]>,
  element: Object as PropType<SlateElement>,
  selection: Object as PropType<Range | null>
  // renderElement?: (props: RenderElementProps) => JSX.Element
  // renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
}

export const Element = defineComponent({
  name: 'Element',
  props: ElementProps,
  setup(props) {
    const ref = useRef<HTMLElement>()
    const editor = useSlateStatic()
    const readOnly = useReadOnly()

    useEffect(() => {
      const element = props.element!
      const key = ReactEditor.findKey(editor, element)
      // Update element-related weak maps with the DOM element ref.
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
      if (ref.value) {
        KEY_TO_ELEMENT?.set(key, ref.value)
        NODE_TO_ELEMENT.set(element, ref.value)
        ELEMENT_TO_NODE.set(ref.value, element)
      } else {
        KEY_TO_ELEMENT?.delete(key)
        NODE_TO_ELEMENT.delete(element)
      }
    })

    return () => {
      const { decorations, element, selection } = props as ElementProps
      const isInline = editor.isInline(element)

      // Attributes that the developer must mix into the element in their
      // custom node renderer component.
      const attributes: {
        'data-slate-node': 'element'
        'data-slate-void'?: true
        'data-slate-inline'?: true
        contentEditable?: false
        dir?: 'rtl'
        ref: any
      } = {
        'data-slate-node': 'element',
        ref
      }

      if (isInline) {
        attributes['data-slate-inline'] = true
      }

      // If it's a block node with inline children, add the proper `dir` attribute
      // for text direction.
      if (!isInline && Editor.hasInlines(editor, element)) {
        const text = Node.string(element)
        const dir = getDirection(text)

        if (dir === 'rtl') {
          attributes.dir = dir
        }
      }

      let Tag: any
      let text: any
      if (Editor.isVoid(editor, element)) {
        attributes['data-slate-void'] = true

        if (!readOnly && isInline) {
          attributes.contentEditable = false
        }

        Tag = isInline ? 'span' : 'div'
        ;[[text]] = Node.texts(element)
        NODE_TO_INDEX.set(text, 0)
        NODE_TO_PARENT.set(text, element)
      }

      console.info('%c Element Rerender ', 'background: yellow; padding:3px 0px; color: #000;')

      return (
        <DefaultElement element={element} attributes={attributes}>
          {Editor.isVoid(editor, element) ? (
            readOnly ? null : (
              <Tag
                data-slate-spacer
                style={{
                  height: '0',
                  color: 'transparent',
                  outline: 'none',
                  position: 'absolute'
                }}>
                <Text decorations={[]} isLast={false} parent={element} text={text} />
              </Tag>
            )
          ) : (
            <Children decorations={decorations} node={element} selection={selection} />
          )}
        </DefaultElement>
      )
    }
  }
})

const DefaultElementProps = {
  element: Object as PropType<SlateElement>,
  attributes: Object
}

const DefaultElement = defineComponent({
  name: 'DefaultElement',
  props: DefaultElementProps,
  setup(props, { slots }) {
    const editor = useSlateStatic()
    return () => {
      const { attributes, element } = props as any
      const Tag = editor.isInline(element) ? 'span' : 'div'
      return (
        <Tag {...attributes} style={{ position: 'relative' }}>
          {renderSlot(slots, 'default')}
        </Tag>
      )
    }
  }
})

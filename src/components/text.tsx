import { Element, Range, Text as SlateText } from 'slate'
import { EDITOR_TO_KEY_TO_ELEMENT, ELEMENT_TO_NODE, NODE_TO_ELEMENT } from '../utils/weak-maps'
import { defineComponent, onMounted, onUpdated, PropType, ref as useRef, toRaw } from 'vue'
import Leaf from './leaf'
import { useSlateStatic } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'
import useEffect from '../hooks/use-effect'

/**
 * Text.
 */

type TextProps = {
  decorations: Range[]
  isLast: boolean
  parent: Element
  text: SlateText
  // renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  // renderLeaf?: (props: RenderLeafProps) => JSX.Element
}

const TextProps = {
  decorations: Array as PropType<Range[]>,
  isLast: Boolean,
  parent: Object as PropType<Element>,
  text: Object as PropType<SlateText>
  // renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  // renderLeaf?: (props: RenderLeafProps) => JSX.Element
}

const Text = defineComponent({
  name: 'Text',
  props: TextProps,
  setup(props) {
    const editor = useSlateStatic()
    const ref = useRef<HTMLSpanElement | null>(null)

    const { decorations, text } = props as TextProps
    const leaves = SlateText.decorations(text, decorations) //TODO: toRef
    const key = ReactEditor.findKey(editor, text)

    // Update element-related weak maps with the DOM element ref.
    useEffect(() => {
      const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
      if (ref.value) {
        KEY_TO_ELEMENT?.set(key, ref.value)
        NODE_TO_ELEMENT.set(text, ref.value)
        ELEMENT_TO_NODE.set(ref.value, text)
      } else {
        KEY_TO_ELEMENT?.delete(key)
        NODE_TO_ELEMENT.delete(text)
      }
    })

    return () => {
      console.info('%c Text Rerender ', 'background: blue; padding:3px 0px; color: #fff;')
      console.info(toRaw(props))

      const { isLast, parent, text } = props as TextProps
      return (
        <span data-slate-node="text" ref={ref}>
          {leaves.map((leaf, i) => {
            return (
              <Leaf
                isLast={isLast && i === leaves.length - 1}
                key={`${key.id}-${i}`}
                // renderPlaceholder={renderPlaceholder}
                leaf={leaf}
                text={text}
                parent={parent}
                // renderLeaf={renderLeaf}
              />
            )
          })}
        </span>
      )
    }
  }
})

export default Text

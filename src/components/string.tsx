import { Editor, Element, Node, Path, Text } from 'slate'
import { defineComponent, Prop, ref as useRef, watchEffect } from 'vue'
import { useSlateStatic } from '../hooks/use-slate-static'
import { ReactEditor } from '../plugin/react-editor'

/**
 * Leaf content strings.
 */
type StringProps = { isLast: boolean; leaf: Text; parent: Element; text: Text }

const StringProps = {
  isLast: Boolean,
  leaf: Object as Prop<Text>,
  parent: Object as Prop<Element>,
  text: Object as Prop<Text>
}

const RawString = defineComponent({
  name:'TextString',
  props: StringProps,
  setup(props) {
    const editor = useSlateStatic() // keep reactivity
    return () => {
      const { isLast, leaf, parent, text } = props as any
      const path = ReactEditor.findPath(editor, text)
      const parentPath = Path.parent(path)

      // COMPAT: Render text inside void nodes with a zero-width space.
      // So the node can contain selection but the text is not visible.
      if (editor.isVoid(parent)) {
        return <ZeroWidthString length={Node.string(parent).length} />
      }

      // COMPAT: If this is the last text node in an empty block, render a zero-
      // width space that will convert into a line break when copying and pasting
      // to support expected plain text.
      if (
        leaf.text === '' &&
        parent.children[parent.children.length - 1] === text &&
        !editor.isInline(parent) &&
        Editor.string(editor, parentPath) === ''
      ) {
        return <ZeroWidthString isLineBreak />
      }

      // COMPAT: If the text is empty, it's because it's on the edge of an inline
      // node, so we render a zero-width space so that the selection can be
      // inserted next to it still.
      if (leaf.text === '') {
        return <ZeroWidthString />
      }

      // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
      // so we need to add an extra trailing new lines to prevent that.
      if (isLast && leaf.text.slice(-1) === '\n') {
        return <TextString isTrailing text={leaf.text} />
      }

      return <TextString text={leaf.text} />
    }
  }
})

/**
 * Leaf strings with text in them.
 */

const TextString = defineComponent({
  name:'TextString',
  props: { text: String, isTrailing: Boolean },
  setup(props) {
    const ref = useRef<HTMLSpanElement | null>(null)
    const forceUpdateCount = useRef(0)
    watchEffect(() => {
      if (ref.value && ref.value.textContent !== props.text) {
        forceUpdateCount.value += 1
      }
    })
    // This component may have skipped rendering due to native operations being
    // applied. If an undo is performed React will see the old and new shadow DOM
    // match and not apply an update. Forces each render to actually reconcile.
    return () => (
      <span data-slate-string ref={ref} key={forceUpdateCount.value}>
        {props.text}
        {props.isTrailing ? '\n' : null}
      </span>
    )
  }
})

/**
 * Leaf strings without text, render as zero-width strings.
 */

const ZeroWidthString = defineComponent({
  name:'ZeroWidthString',
  props: {
    length: Number,
    isLineBreak: Boolean
  },
  render() {
    const { length = 0, isLineBreak = false } = this.$props
    return (
      <span data-slate-zero-width={isLineBreak ? 'n' : 'z'} data-slate-length={length}>
        {'\uFEFF'}
        {isLineBreak ? <br /> : null}
      </span>
    )
  }
})

export default RawString

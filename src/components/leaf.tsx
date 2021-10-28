import { Element, Text } from 'slate'
import String from './string'
import { DefaultPlaceholder } from './editable'
import { defineComponent, onBeforeUpdate, PropType, ref, renderSlot, watch } from 'vue'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import useEffect from '../hooks/use-effect'

/**
 * Individual leaves in a text node with unique formatting.
 */

type LeafProps = {
  isLast: boolean
  leaf: Text
  parent: Element
  text: Text
  // renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  // renderLeaf?: (props: RenderLeafProps) => JSX.Element
}

const LeafProps = {
  isLast: Boolean,
  leaf: Object as PropType<Text>,
  parent: Object as PropType<Element>,
  text: Object as PropType<Text>
}

const Leaf = defineComponent({
  name: 'Leaf',
  props: LeafProps,
  setup(props) {
    const placeholderRef = ref<HTMLSpanElement | null>(null)

    useEffect(() => {
      const placeholderEl = placeholderRef?.value
      const editorEl = document.querySelector<HTMLDivElement>('[data-slate-editor="true"]')

      if (!placeholderEl || !editorEl) {
        return
      }

      editorEl.style.minHeight = `${placeholderEl.clientHeight}px`
    }, [() => props.leaf, placeholderRef])

    onBeforeUpdate(() => {
      ;(document.querySelector<HTMLDivElement>('[data-slate-editor="true"]') as HTMLDivElement).style.minHeight = 'auto'
    })

    return () => {
      const { leaf, isLast, text, parent } = props as LeafProps
      const attributes: { 'data-slate-leaf': true } = { 'data-slate-leaf': true }
      console.info('%c Leaf Rerender ', 'background: green;  padding:3px 0px; color: #fff;')
      console.log(leaf)

      return (
        <DefaultLeaf attributes={attributes} leaf={leaf} text={text}>
          {(leaf as any)[PLACEHOLDER_SYMBOL] ? (
            <>
              <DefaultPlaceholder
                attributes={{
                  'data-slate-placeholder': true,
                  style: {
                    position: 'absolute',
                    pointerEvents: 'none',
                    width: '100%',
                    maxWidth: '100%',
                    display: 'block',
                    opacity: '0.333',
                    userSelect: 'none',
                    textDecoration: 'none'
                  },
                  contentEditable: false,
                  ref: placeholderRef
                }}>
                {(leaf as any).placeholder}
              </DefaultPlaceholder>
              <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
            </>
          ) : (
            <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
          )}
        </DefaultLeaf>
      )
    }
  }
})

const DefaultLeafProps = {
  leaf: Object as PropType<Text>,
  text: Object as PropType<Text>,
  attributes: Object as PropType<{
    'data-slate-leaf': boolean
  }>
}
export const DefaultLeaf = defineComponent({
  name: 'DefaultLeaf',
  props: DefaultLeafProps,
  render() {
    return <span {...this.$props.attributes}>{renderSlot(this.$slots, 'default')}</span>
  }
})

export default Leaf

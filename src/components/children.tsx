import { Ancestor, Descendant, Editor, Element, Range } from 'slate'
import { ReactEditor, useSlateStatic } from '..'
import { defineComponent, PropType, toRaw } from 'vue'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import { useDecorate } from '../hooks/use-decorate'
import TextComponent from '../components/text'
import { Element as ElementComponent } from '../components/element'
import { defaultDecorate } from './editable'

type ChildrenProps = {
  decorations: Range[]
  node: Ancestor
  // renderElement?: (props: RenderElementProps) => JSX.Element
  // renderPlaceholder: (props: RenderPlaceholderProps) => JSX.Element
  // renderLeaf?: (props: RenderLeafProps) => JSX.Element
  selection: Range | null
}

const ChildrenProps = {
  decorations: Array as PropType<Range[]>,
  node: Object as PropType<Ancestor>,
  selection: Object as PropType<Range | null>
}

export const Children = defineComponent({
  props: ChildrenProps,
  setup(props) {
    return () => {
      const { decorations, node, selection } = props as ChildrenProps
      const decorate = useDecorate() || defaultDecorate
      const editor = useSlateStatic()
      const path = ReactEditor.findPath(editor, node)
      const isLeafBlock = Element.isElement(node) && !editor.isInline(node) && Editor.hasInlines(editor, node)

      console.log(toRaw(node))
      return (
        <>
          {node.children.map((_, i) => {
            const p = path.concat(i)
            const n = node.children[i] as Descendant
            const key = ReactEditor.findKey(editor, n)
            const range = Editor.range(editor, p)
            const sel = selection && Range.intersection(range, selection)
            const ds = decorate([n, p])

            for (const dec of decorations) {
              const d = Range.intersection(dec, range)

              if (d) {
                ds.push(d)
              }
            }
            NODE_TO_INDEX.set(n, i)
            NODE_TO_PARENT.set(n, node)
            if (Element.isElement(n)) {
              return <ElementComponent decorations={ds} element={n} key={key.id} selection={sel} />
            } else {
              return (
                <TextComponent
                  decorations={ds}
                  key={key.id}
                  isLast={isLeafBlock && i === node.children.length - 1}
                  parent={node}
                  text={n}
                />
              )
            }
          })}
        </>
      )
    }
  }
})

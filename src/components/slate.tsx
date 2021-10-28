import { Descendant, Editor, Node } from 'slate'
import { ReactEditor } from '../plugin/react-editor'
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps'
import { defineComponent, onBeforeUnmount, onMounted, PropType, provide, renderSlot, watchEffect } from 'vue'
import { useState } from '../hooks/use-state'
import { EditorFocusedKey, SlateKey, SlateStaticKey } from '../utils/injectionSymbols'
import useEffect from '../hooks/use-effect'

/**
 * A wrapper around the provider to handle `onChange` events, because the editor
 * is a mutable singleton so it won't ever register as "changed" otherwise.
 */

type SlateProps = {
  editor: ReactEditor
  value: Descendant[]
  onChange: (value: Descendant[]) => void
}

const SlateProps = {
  value: Array as PropType<Descendant[]>,
  editor: {
    type: Object as PropType<ReactEditor>,
    required: true
  },
  onChange: Function as PropType<(value: Descendant[]) => void>
}

export const Slate = defineComponent({
  name: 'Slate',
  props: SlateProps,
  emits: ['change'],
  setup(props, { emit, slots }) {
    const [context, setContext] = useState<[ReactEditor]>(() => {
      const { editor, value = [], onChange, ...rest } = props
      if (!Node.isNodeList(value)) {
        throw new Error(`[Slate] value is invalid! Expected a list of elements` + `but got: ${JSON.stringify(value)}`)
      }
      if (!Editor.isEditor(editor)) {
        throw new Error(`[Slate] editor is invalid! you passed:` + `${JSON.stringify(editor)}`)
      }
      editor.children = value
      Object.assign(editor, rest)
      return [editor]
    })
    const [isFocused, setIsFocused] = useState(ReactEditor.isFocused(props.editor!))

    const onContextChange = () => {
      emit('change', props.editor!.children)
      props.onChange?.(props.editor!.children)
      setContext([props.editor!])
    }

    watchEffect(() => {
      EDITOR_TO_ON_CHANGE.set(props.editor!, onContextChange)
    })

    const autoFocus = () => setIsFocused(ReactEditor.isFocused(context.value[0]!))
    useEffect(() => {
      document.addEventListener('focus', autoFocus, true)
      document.addEventListener('blur', autoFocus, true)

      return () => {
        EDITOR_TO_ON_CHANGE.set(props.editor!, () => {})
        document.removeEventListener('focus', autoFocus, true)
        document.removeEventListener('blur', autoFocus, true)
      }
    }, [])

    provide(SlateKey, context)
    provide(SlateStaticKey, props.editor)
    provide(EditorFocusedKey, isFocused.value)

    return () => {
      console.info('%c Slate Rerender ', 'background: #000;  padding:3px 0px; color: #fff;')
      return renderSlot(slots, 'default')
    }
  }
})

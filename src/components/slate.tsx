import { Descendant, Editor, Node } from 'slate'
import { ReactEditor } from '../plugin/react-editor'
import { EDITOR_TO_ON_CHANGE } from '../utils/weak-maps'
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  PropType,
  provide,
  renderSlot,
  toRaw,
  watchEffect
} from 'vue'
import { useState } from '../hooks/use-state'
import { EditorFocusedKey, SlateKey, SlateStaticKey } from '../utils/injectionSymbols'

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
      editor.children = toRaw(value)
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

    const fn = () => setIsFocused(ReactEditor.isFocused(props.editor!))
    const fn2 = () => setIsFocused(ReactEditor.isFocused(props.editor!))

    onMounted(() => {
      document.addEventListener('focus', fn, true)
      document.addEventListener('blur', fn2, true)
    })

    onBeforeUnmount(() => {
      EDITOR_TO_ON_CHANGE.set(props.editor!, () => {})
      document.removeEventListener('focus', fn, true)
      document.removeEventListener('blur', fn2, true)
    })

    onUpdated(() => {
      setIsFocused(ReactEditor.isFocused(props.editor!))
    })

    provide(SlateKey, context.value)
    provide(SlateStaticKey, props.editor)
    provide(EditorFocusedKey, isFocused.value)

    return () => renderSlot(slots, 'default')
  }
})

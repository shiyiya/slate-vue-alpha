import { defineComponent, inject, PropType, provide, reactive, ref, toRaw, watchEffect } from 'vue'
import { withReact } from '../src/plugin/with-react'
import { Editable, Slate } from '../src/index'
import { Descendant, createEditor } from 'slate'
import { random } from 'lodash'
import { setAutoFreeze } from 'immer'

setAutoFreeze(false)

export default {
  setup() {
    const state = reactive({ count: 0, o: { count: 0 }, readOnly: false, autofocus: true })
    const editor = withReact(createEditor())
    let md = ref<any[]>([
      {
        type: 'paragraph',
        children: [{ text: 'This is editable plain text, just like a <textarea>!' }]
      }
    ])

    const onChange = (value: any[]) => {
      console.log('app', toRaw(value[0]?.children?.[0].text))
      md.value = value
    }

    const self = ref(0)

    provide('o', self)

    return () => (
      <>
        <Slate editor={editor} value={md.value} onChange={onChange}>
          <Editable placeholder="Typo anything..." readOnly={state.readOnly} autofocus={state.autofocus} />
        </Slate>

        <p />

        <Switch
          onChange={() => {
            state.readOnly = !state.readOnly
          }}
          title="readOnly"
          flag={state.readOnly}
        />

        {/*<button onClick={() => (md.value = [{ text: '' }])}>Empty Editor</button>*/}
        {/*<button onClick={() => console.log(editor.children)}>Log Slate Value</button>*/}
        {/*<button onClick={() => console.log(editor.insertText('\r\n insert text'),editor.children)}>insert Slate Value</button>*/}
        {/*<button onClick={() => console.log(editor.deleteBackward('word'))}>Del Value</button>*/}

        {/*<Div />*/}
      </>
    )
  }
}

const Switch = defineComponent({
  props: {
    flag: Boolean,
    onChange: Function as PropType<() => void>,
    title: String
  },
  setup(props) {
    return () => {
      const key = `${random()}`
      return (
        <span>
          <input type="checkbox" id={key} checked={props.flag} onChange={props.onChange!} />
          <label for={key}>{props.title}</label>
        </span>
      )
    }
  }
})

const Div = defineComponent({
  setup(props) {
    const o = inject('o') as any
    const self = ref(0)
    watchEffect(() => {
      console.log(self.value)
    })
    return () => {
      console.log('children rerender', o)
      return (
        <p onClick={() => (self.value += 1)}>
          props: {o.value}
          {/*self: {self.value}*/}
        </p>
      )
    }
  }
})

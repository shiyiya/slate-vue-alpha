import { reactive, ref } from 'vue'
import { withReact } from '../src/plugin/with-react'
import { createEditor, Editable, Slate } from '../src/index'
import { Descendant } from 'slate'

export default {
  setup() {
    const state = reactive({ count: 0, o: { count: 0 }, readOnly: false })
    const editor = withReact(createEditor())
    let md = ref<any>([
      {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }]
      }
    ])

    const onChange = (value: Descendant[]) => {
      md.value = value
    }

    return () => (
      <div class="slate">
        <Slate editor={editor} value={md.value} onChange={onChange}>
          <Editable placeholder="Typo anything..." readOnly={state.readOnly} />
        </Slate>
      </div>
    )
  }
}

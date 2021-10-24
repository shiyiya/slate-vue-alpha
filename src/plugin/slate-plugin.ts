import { createEditor } from 'slate'
import { App } from 'vue'
import { ReactEditor } from './react-editor'
import { withReact } from './with-react'

interface SlatePluginOptions {
  editorCreated?: (editor: ReactEditor) => any
}

export const SlatePlugin = {
  install(app: App, options?: SlatePluginOptions) {
    app.mixin({
      beforeCreate() {
        if (!this.$editor) {
          // assume that the editor's root starts from the component which is using Slate
          if (this.$options.components.Slate) {
            this.$editor = withReact(createEditor())
            if (options?.editorCreated) {
              options.editorCreated.call(this, this.$editor)
            }
          } else {
            this.$editor = this.$parent && this.$parent.$editor
          }
        }
      }
    })
  }
}

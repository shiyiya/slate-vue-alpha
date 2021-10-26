import { App } from 'vue'
import { ReactEditor } from './react-editor'

interface SlatePluginOptions {
  editorCreated?: (editor: ReactEditor) => any
}

export const SlatePlugin = {
  install(app: App, options?: SlatePluginOptions) {}
}

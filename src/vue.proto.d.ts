import { ReactEditor } from './plugin/react-editor'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $editor: ReactEditor
  }
}

declare global {
  interface ShadowRoot {
    getSelection: Function
  }
}

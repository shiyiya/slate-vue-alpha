import { inject } from 'vue'
import { EditorKey } from '../utils/injectionSymbols'

/**
 * Get the current editor object from the React context.
 * @deprecated Use useSlateStatic instead.
 */

export const useEditor = () => {
  return inject(EditorKey)
}

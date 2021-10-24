import { inject } from 'vue'
import { SlateKey } from '../utils/injectionSymbols'

export function useSlate() {
  const [editor] = inject(SlateKey)!
  return  editor
}

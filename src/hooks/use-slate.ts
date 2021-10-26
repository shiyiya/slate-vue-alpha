import { inject } from 'vue'
import { SlateKey } from '../utils/injectionSymbols'

export function useSlate() {
  return inject(SlateKey)!
}

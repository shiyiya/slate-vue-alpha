import { inject } from 'vue'
import { SlateStaticKey } from '../utils/injectionSymbols'

export function useSlateStatic() {
  return inject(SlateStaticKey)!
}

import { inject } from 'vue'
import { SlateReadOnlyKey } from '../utils/injectionSymbols'

export function useReadOnly() {
  return inject(SlateReadOnlyKey)!
}

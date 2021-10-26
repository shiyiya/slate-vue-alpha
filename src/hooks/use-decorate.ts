import { inject } from 'vue'
import { SlateDecorateKey } from '../utils/injectionSymbols'

export const useDecorate = () => {
  return inject(SlateDecorateKey)!
}

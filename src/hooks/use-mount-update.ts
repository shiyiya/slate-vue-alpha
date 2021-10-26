import { onMounted, onUpdated } from '@vue/runtime-dom'

const useMountedUpdateEffect = (effect: () => void): void => {
  onMounted(effect)
  onUpdated(effect)
}

export default useMountedUpdateEffect

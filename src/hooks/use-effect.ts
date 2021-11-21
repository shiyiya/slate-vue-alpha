import { onBeforeUnmount, onMounted, onUpdated, watch, WatchCallback, WatchSource } from '@vue/runtime-dom'

type Effect = (() => void) | (() => () => void)

const useEffect = <T extends (WatchSource<unknown> | object)[]>(effect: Effect, deps?: [...T]) => {
  let unmountEffect: (() => void) | null = null

  onMounted(() => {
    const _unmountEffect = effect()
    if (_unmountEffect) {
      unmountEffect = _unmountEffect
    }
  })

  if (Array.isArray(deps)) {
    if (deps.length !== 0) {
      watch(deps, effect)
    }
  } else {
    onUpdated(effect)
  }

  onBeforeUnmount(() => {
    unmountEffect?.()
  })
}

export default useEffect

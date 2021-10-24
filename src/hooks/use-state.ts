import { ref, UnwrapRef } from 'vue'

export const useState = <T extends any>(initialState: T extends Function ? never : T | (() => T)) => {
  const state = ref<T>(typeof initialState === 'function' ? initialState() : initialState)

  return [
    state,
    (value: UnwrapRef<T>) => {
      state.value = value
    }
  ] as const
}

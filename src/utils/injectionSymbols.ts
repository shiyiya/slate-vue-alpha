import {NodeEntry, Range} from 'slate'
import { InjectionKey } from 'vue'
import { ReactEditor } from 'slate-vue-alpha'

export const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export const PolySymbol = (name: string) => (hasSymbol ? Symbol(name) : '[slate-vue]' + name)

export const SlateKey = /*#__PURE__*/ PolySymbol('slate') as InjectionKey<[ReactEditor]>

export const SlateStaticKey = /*#__PURE__*/ PolySymbol('slateStatic') as InjectionKey<ReactEditor>

/**
 * Get the current editor object from the React context.
 * @deprecated Use useSlateStatic instead.
 */
export const EditorKey = /*#__PURE__*/ PolySymbol('slateStatic') as InjectionKey<ReactEditor>

export const EditorFocusedKey = /*#__PURE__*/ PolySymbol('editor_Focused') as InjectionKey<boolean>

export const SlateReadOnlyKey = /*#__PURE__*/ PolySymbol('editor_readOnly') as InjectionKey<boolean>

export const SlateDecorateKey = /*#__PURE__*/ PolySymbol('editor_Decorate') as InjectionKey<
  (entry: NodeEntry) => Range[]
>

export const SlateSelectedKey = /*#__PURE__*/ PolySymbol('editor_Selected') as InjectionKey<boolean>

import { Editor, Element, Node, NodeEntry, Path, Range, Text, Transforms } from 'slate'
import { direction as getDirection } from 'direction'
import throttle from 'lodash/throttle'
import scrollIntoView from 'scroll-into-view-if-needed'
import type * as React from 'vue'
import { defineComponent, PropType, provide, ref as useRef, renderSlot, watch } from 'vue'
import { ReactEditor } from '../plugin/react-editor'
import {
  DOMElement,
  DOMNode,
  DOMRange,
  getDefaultView,
  isDOMElement,
  isDOMNode,
  isPlainTextOnlyPaste
} from '../utils/dom'
import { SlateDecorateKey, SlateReadOnlyKey } from '../utils/injectionSymbols'
import { useState } from '../hooks/use-state'
import {
  EDITOR_TO_ELEMENT,
  EDITOR_TO_WINDOW,
  ELEMENT_TO_NODE,
  IS_FOCUSED,
  IS_READ_ONLY,
  NODE_TO_ELEMENT,
  PLACEHOLDER_SYMBOL
} from '../utils/weak-maps'
import {
  HAS_BEFORE_INPUT_SUPPORT,
  IS_CHROME,
  IS_FIREFOX,
  IS_FIREFOX_LEGACY,
  IS_IOS,
  IS_QQBROWSER,
  IS_SAFARI
} from '../utils/environment'
import Hotkeys from '../utils/hotkeys'
import { useSlate } from '../hooks/use-slate'
import { Children } from './children'
import useEffect from '../hooks/use-effect'

export type EditableProps = {
  decorate?: (entry: NodeEntry) => Range[]
  onDOMBeforeInput?: (event: InputEvent) => void
  placeholder?: string
  readOnly?: boolean
  role?: string
  style?: React.CSSProperties
  // renderElement?: (props: RenderElementProps) => JSX.Element
  // renderLeaf?: (props: RenderLeafProps) => JSX.Element
  // renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element
  scrollSelectionIntoView?: (editor: ReactEditor, domRange: DOMRange) => void
  as?: ElementType /* React.ElementType */
} & React.TextareaHTMLAttributes

const EditableProps = {
  decorate: Function as PropType<(entry: NodeEntry) => Range[]>,
  onDOMBeforeInput: Function as PropType<(event: InputEvent) => void>, // TODO: emit
  placeholder: String,
  readOnly: Boolean,
  role: String,
  style: Object,
  scrollSelectionIntoView: Function as PropType<(editor: ReactEditor, domRange: DOMRange) => void>,
  as: String,
  autofocus: Boolean,
  spellcheck: Boolean,
  autocapitalize: Boolean,
  autocorrect: Boolean
}

export const Editable = defineComponent({
  name: 'Editable',
  props: EditableProps,
  setup(props) {
    const slate = useSlate()
    // Rerender editor when composition status changed
    const [isComposing, setIsComposing] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>()
    const deferredOperations = useRef<DeferredOperation[]>([])

    // Update internal state on each render.
    watch(
      [slate, () => props.readOnly],
      () => {
        IS_READ_ONLY.set(slate.value[0], props.readOnly ?? false)
      },
      { immediate: true }
    )

    // Keep track of some state for the event handler logic.
    const state = {
      isComposing: false,
      hasInsertPrefixInCompositon: false,
      isDraggingInternally: false,
      isUpdatingSelection: false,
      latestElement: null as DOMElement | null
    }

    // Whenever the editor updates...
    useEffect(() => {
      const { scrollSelectionIntoView = defaultScrollSelectionIntoView } = props
      const editor = slate.value[0]
      // Update element-related weak maps with the DOM element ref.
      let window
      if (ref.value && (window = getDefaultView(ref.value))) {
        EDITOR_TO_WINDOW.set(editor, window)
        EDITOR_TO_ELEMENT.set(editor, ref.value)
        NODE_TO_ELEMENT.set(editor, ref.value)
        ELEMENT_TO_NODE.set(ref.value, editor)
      } else {
        NODE_TO_ELEMENT.delete(editor)
      }

      // Make sure the DOM selection state is in sync.
      const { selection } = editor
      const root = ReactEditor.findDocumentOrShadowRoot(editor)
      const domSelection = root.getSelection()

      if (state.isComposing || !domSelection || !ReactEditor.isFocused(editor)) {
        return
      }

      const hasDomSelection = domSelection.type !== 'None'

      // If the DOM selection is properly unset, we're done.
      if (!selection && !hasDomSelection) {
        return
      }

      // verify that the dom selection is in the editor
      const editorElement = EDITOR_TO_ELEMENT.get(editor)!
      let hasDomSelectionInEditor = false
      if (editorElement.contains(domSelection.anchorNode) && editorElement.contains(domSelection.focusNode)) {
        hasDomSelectionInEditor = true
      }

      // If the DOM selection is in the editor and the editor selection is already correct, we're done.
      if (hasDomSelection && hasDomSelectionInEditor && selection) {
        const slateRange = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: true,

          // domSelection is not necessarily a valid Slate range
          // (e.g. when clicking on contentEditable:false element)
          suppressThrow: true
        })
        if (slateRange && Range.equals(slateRange, selection)) {
          return
        }
      }

      // when <Editable/> is being controlled through external value
      // then its children might just change - DOM responds to it on its own
      // but Slate's value is not being updated through any operation
      // and thus it doesn't transform selection on its own
      if (selection && !ReactEditor.hasRange(editor, selection)) {
        editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: false
        })
        return
      }

      // Otherwise the DOM selection is out of sync, so update it.
      state.isUpdatingSelection = true

      const newDomRange = selection && ReactEditor.toDOMRange(editor, selection)

      if (newDomRange) {
        if (Range.isBackward(selection!)) {
          domSelection.setBaseAndExtent(
            newDomRange.endContainer,
            newDomRange.endOffset,
            newDomRange.startContainer,
            newDomRange.startOffset
          )
        } else {
          domSelection.setBaseAndExtent(
            newDomRange.startContainer,
            newDomRange.startOffset,
            newDomRange.endContainer,
            newDomRange.endOffset
          )
        }
        scrollSelectionIntoView(editor, newDomRange)
      } else {
        domSelection.removeAllRanges()
      }

      setTimeout(() => {
        // COMPAT: In Firefox, it's not enough to create a range, you also need
        // to focus the contenteditable element too. (2016/11/16)
        if (newDomRange && IS_FIREFOX) {
          const el = ReactEditor.toDOMNode(editor, editor)
          el.focus()
        }

        state.isUpdatingSelection = false
      })
    })

    // The autoFocus TextareaHTMLAttribute doesn't do anything on a div, so it
    // needs to be manually focused.
    useEffect(() => {
      if (ref.value && props.autofocus) {
        ref.value.focus()
      }
    }, [() => props.autofocus])

    // Listen on the native `beforeinput` event to get real "Level 2" events. This
    // is required because React's `beforeinput` is fake and never really attaches
    // to the real event sadly. (2019/11/01)
    // https://github.com/facebook/react/issues/11211
    const onDOMBeforeInput = (event: InputEvent) => {
      const { onDOMBeforeInput: propsOnDOMBeforeInput, readOnly = false } = props
      const editor = slate.value[0]
      if (!readOnly && hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
        const { selection } = editor
        const { inputType: type } = event
        const data = (event as any).dataTransfer || event.data || undefined

        // These two types occur while a user is composing text and can't be
        // cancelled. Let them through and wait for the composition to end.
        if (type === 'insertCompositionText' || type === 'deleteCompositionText') {
          return
        }

        let native = false
        if (
          type === 'insertText' &&
          selection &&
          Range.isCollapsed(selection) &&
          // Only use native character insertion for single characters a-z or space for now.
          // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
          // causes duplicate inserts.
          event.data &&
          event.data.length === 1 &&
          /[a-z ]/i.test(event.data) &&
          // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
          // When there is an inline element, e.g. a link, and you select
          // right after it (the start of the next node).
          selection.anchor.offset !== 0
        ) {
          native = true

          // Skip native if there are marks, as
          // `insertText` will insert a node, not just text.
          if (editor.marks) {
            native = false
          }

          // Chrome also has issues correctly editing the end of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1259100
          // Therefore we don't allow native events to insert text at the end of nodes.
          const { anchor } = selection
          const inline = Editor.above(editor, {
            at: anchor,
            match: (n) => Editor.isInline(editor, n),
            mode: 'highest'
          })
          if (inline) {
            const [, inlinePath] = inline

            if (Editor.isEnd(editor, selection.anchor, inlinePath)) {
              native = false
            }
          }
        }

        if (!native) {
          event.preventDefault()
        }

        // COMPAT: For the deleting forward/backward input types we don't want
        // to change the selection because it is the range that will be deleted,
        // and those commands determine that for themselves.
        if (!type.startsWith('delete') || type.startsWith('deleteBy')) {
          const [targetRange] = (event as any).getTargetRanges()

          if (targetRange) {
            const range = ReactEditor.toSlateRange(editor, targetRange, {
              exactMatch: false,
              suppressThrow: false
            })

            if (!selection || !Range.equals(selection, range)) {
              Transforms.select(editor, range)
            }
          }
        }

        // COMPAT: If the selection is expanded, even if the command seems like
        // a delete forward/backward command it should delete the selection.
        if (selection && Range.isExpanded(selection) && type.startsWith('delete')) {
          const direction = type.endsWith('Backward') ? 'backward' : 'forward'
          Editor.deleteFragment(editor, { direction })
          return
        }

        switch (type) {
          case 'deleteByComposition':
          case 'deleteByCut':
          case 'deleteByDrag': {
            Editor.deleteFragment(editor)
            break
          }

          case 'deleteContent':
          case 'deleteContentForward': {
            Editor.deleteForward(editor)
            break
          }

          case 'deleteContentBackward': {
            Editor.deleteBackward(editor)
            break
          }

          case 'deleteEntireSoftLine': {
            Editor.deleteBackward(editor, { unit: 'line' })
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineBackward': {
            Editor.deleteBackward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineBackward': {
            Editor.deleteBackward(editor, { unit: 'line' })
            break
          }

          case 'deleteHardLineForward': {
            Editor.deleteForward(editor, { unit: 'block' })
            break
          }

          case 'deleteSoftLineForward': {
            Editor.deleteForward(editor, { unit: 'line' })
            break
          }

          case 'deleteWordBackward': {
            Editor.deleteBackward(editor, { unit: 'word' })
            break
          }

          case 'deleteWordForward': {
            Editor.deleteForward(editor, { unit: 'word' })
            break
          }

          case 'insertLineBreak':
          case 'insertParagraph': {
            Editor.insertBreak(editor)
            break
          }

          case 'insertFromComposition':
          case 'insertFromDrop':
          case 'insertFromPaste':
          case 'insertFromYank':
          case 'insertReplacementText':
          case 'insertText': {
            if (type === 'insertFromComposition') {
              // COMPAT: in Safari, `compositionend` is dispatched after the
              // `beforeinput` for "insertFromComposition". But if we wait for it
              // then we will abort because we're still composing and the selection
              // won't be updated properly.
              // https://www.w3.org/TR/input-events-2/
              state.isComposing && setIsComposing(false)
              state.isComposing = false
            }

            const window = ReactEditor.getWindow(editor)
            if (data instanceof window.DataTransfer) {
              ReactEditor.insertData(editor, data as DataTransfer)
            } else if (typeof data === 'string') {
              // Only insertText operations use the native functionality, for now.
              // Potentially expand to single character deletes, as well.
              if (native) {
                deferredOperations.value.push(() => Editor.insertText(editor, data))
              } else {
                Editor.insertText(editor, data)
              }
            }

            break
          }
        }
      }
    }

    // Attach a native DOM event handler for `beforeinput` events, because React's
    // built-in `onBeforeInput` is actually a leaky polyfill that doesn't expose
    // real `beforeinput` events sadly... (2019/11/04)
    // https://github.com/facebook/react/issues/11211
    useEffect(() => {
      if (ref.value && HAS_BEFORE_INPUT_SUPPORT) {
        ref.value.addEventListener('beforeinput', onDOMBeforeInput)
      }

      return () => {
        if (ref.value && HAS_BEFORE_INPUT_SUPPORT) {
          ref.value.removeEventListener('beforeinput', onDOMBeforeInput)
        }
      }
    }, [])

    // Listen on the native `selectionchange` event to be able to update any time
    // the selection changes. This is required because React's `onSelect` is leaky
    // and non-standard so it doesn't fire until after a selection has been
    // released. This causes issues in situations where another change happens
    // while a selection is being dragged.
    const onDOMSelectionChange = throttle(() => {
      if (!state.isComposing && !state.isUpdatingSelection && !state.isDraggingInternally) {
        const editor = slate.value[0]
        const root = ReactEditor.findDocumentOrShadowRoot(editor)
        const { activeElement } = root
        const el = ReactEditor.toDOMNode(editor, editor)
        const domSelection = root.getSelection()

        if (activeElement === el) {
          state.latestElement = activeElement
          IS_FOCUSED.set(editor, true)
        } else {
          IS_FOCUSED.delete(editor)
        }

        if (!domSelection) {
          return Transforms.deselect(editor)
        }

        const { anchorNode, focusNode } = domSelection

        const anchorNodeSelectable = hasEditableTarget(editor, anchorNode) || isTargetInsideVoid(editor, anchorNode)

        const focusNodeSelectable = hasEditableTarget(editor, focusNode) || isTargetInsideVoid(editor, focusNode)

        if (anchorNodeSelectable && focusNodeSelectable) {
          const range = ReactEditor.toSlateRange(editor, domSelection, {
            exactMatch: false,
            suppressThrow: false
          })
          Transforms.select(editor, range)
        }
      }
    }, 100)

    const scheduleOnDOMSelectionChange = () => setTimeout(onDOMSelectionChange)

    // Attach a native DOM event handler for `selectionchange`, because React's
    // built-in `onSelect` handler doesn't fire for all selection changes. It's a
    // leaky polyfill that only fires on keypresses or clicks. Instead, we want to
    // fire for any change to the selection inside the editor. (2019/11/04)
    // https://github.com/facebook/react/issues/5785
    useEffect(() => {
      const window = ReactEditor.getWindow(slate.value[0])
      window.document.addEventListener('selectionchange', scheduleOnDOMSelectionChange)
      return () => {
        window.document.removeEventListener('selectionchange', scheduleOnDOMSelectionChange)
      }
    }, [])

    // provide Ref or Raw ?
    provide(SlateReadOnlyKey, props.readOnly) // TODO: will update ?
    provide(SlateDecorateKey, props.decorate ?? defaultDecorate)

    return () => {
      const editor = slate.value[0]
      const { placeholder, decorate = defaultDecorate } = props
      const decorations = decorate([editor, []])

      if (
        placeholder &&
        editor.children.length === 1 &&
        Array.from(Node.texts(editor)).length === 1 &&
        Node.string(editor) === '' &&
        !isComposing.value
      ) {
        const start = Editor.start(editor, [])
        decorations.push({
          [PLACEHOLDER_SYMBOL]: true,
          placeholder,
          anchor: start,
          focus: start
        })
      }
      const {
        readOnly = false,
        onDOMBeforeInput: propsOnDOMBeforeInput,
        // renderElement,
        // renderLeaf,
        // renderPlaceholder = (props: any) => <DefaultPlaceholder {...props} />,
        scrollSelectionIntoView = defaultScrollSelectionIntoView,
        style = {},
        as: Component = 'div',
        role = 'textbox',
        autocorrect,
        autocapitalize,
        spellcheck,
        ...attributes
      } = props
      const _spellCheck = !HAS_BEFORE_INPUT_SUPPORT ? false : spellcheck
      const _autoCorrect = !HAS_BEFORE_INPUT_SUPPORT ? 'false' : autocorrect
      const _autoCapitalize = !HAS_BEFORE_INPUT_SUPPORT ? 'false' : autocapitalize

      console.info('%c Editable Rerender ', 'background: #40b3ec;  padding:3px 0px; color: #fff;')

      return (
        <Component
          // COMPAT: The Grammarly Chrome extension works by changing the DOM
          // out from under `contenteditable` elements, which leads to weird
          // behaviors so we have to disable it like editor. (2017/04/24)
          data-gramm={false}
          {...attributes}
          //@ts-ignore
          role={readOnly ? undefined : role}
          // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
          // have to use hacks to make these replacement-based features work.
          spellCheck={_spellCheck}
          autoCorrect={_autoCorrect}
          autoCapitalize={_autoCapitalize}
          data-slate-editor
          data-slate-node="value"
          // explicitly set this
          contentEditable={!readOnly}
          // in some cases, a decoration needs access to the range / selection to decorate a text node,
          // then you will select the whole text node when you select part the of text
          // this magic zIndex="-1" will fix it
          zindex={-1}
          suppressContentEditableWarning
          ref={ref}
          style={{
            // Allow positioning relative to the editable element.
            position: 'relative',
            // Prevent the default outline styles.
            outline: 'none',
            // Preserve adjacent whitespace and new lines.
            whiteSpace: 'pre-wrap',
            // Allow words to break if they are too long.
            wordWrap: 'break-word',
            // Allow for passed-in styles to override anything.
            ...style
          }}
          onBeforeInput={(event: Event /* React.FormEvent<HTMLDivElement> */) => {
            // COMPAT: Certain browsers don't support the `beforeinput` event, so we
            // fall back to React's leaky polyfill instead just for it. It
            // only works for the `insertText` input type.
            if (
              !HAS_BEFORE_INPUT_SUPPORT &&
              !readOnly &&
              !isEventHandled(event, attributes.onBeforeInput) &&
              hasEditableTarget(editor, event.target)
            ) {
              event.preventDefault()
              if (!state.isComposing) {
                const text = (event as any).data as string
                Editor.insertText(editor, text)
              }
            }
          }}
          onInput={() => {
            // Flush native operations, as native events will have propogated
            // and we can correctly compare DOM text values in components
            // to stop rendering, so that browser functions like autocorrect
            // and spellcheck work as expected.
            for (const op of deferredOperations.value) {
              op()
            }
            deferredOperations.value = []
          }}
          onBlur={(event: FocusEvent) => {
            if (
              readOnly ||
              state.isUpdatingSelection ||
              !hasEditableTarget(editor, event.target) ||
              isEventHandled(event, attributes.onBlur)
            ) {
              return
            }

            // COMPAT: If the current `activeElement` is still the previous
            // one, this is due to the window being blurred when the tab
            // itself becomes unfocused, so we want to abort early to allow to
            // editor to stay focused when the tab becomes focused again.
            const root = ReactEditor.findDocumentOrShadowRoot(editor)
            if (state.latestElement === root.activeElement) {
              return
            }

            const { relatedTarget } = event
            const el = ReactEditor.toDOMNode(editor, editor)

            // COMPAT: The event should be ignored if the focus is returning
            // to the editor from an embedded editable element (eg. an <input>
            // element inside a void node).
            if (relatedTarget === el) {
              return
            }

            // COMPAT: The event should be ignored if the focus is moving from
            // the editor to inside a void node's spacer element.
            if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute('data-slate-spacer')) {
              return
            }

            // COMPAT: The event should be ignored if the focus is moving to a
            // non- editable section of an element that isn't a void node (eg.
            // a list item of the check list example).
            if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
              const node = ReactEditor.toSlateNode(editor, relatedTarget)

              if (Element.isElement(node) && !editor.isVoid(node)) {
                return
              }
            }

            // COMPAT: Safari doesn't always remove the selection even if the content-
            // editable element no longer has focus. Refer to:
            // https://stackoverflow.com/questions/12353247/force-contenteditable-div-to-stop-accepting-input-after-it-loses-focus-under-web
            if (IS_SAFARI) {
              const domSelection = root.getSelection()
              domSelection?.removeAllRanges()
            }

            IS_FOCUSED.delete(editor)
          }}
          onClick={(event: MouseEvent) => {
            if (
              !readOnly &&
              hasTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onClick) &&
              isDOMNode(event.target)
            ) {
              const node = ReactEditor.toSlateNode(editor, event.target)
              const path = ReactEditor.findPath(editor, node)

              // At this time, the Slate document may be arbitrarily different,
              // because onClick handlers can change the document before we get here.
              // Therefore we must check that this path actually exists,
              // and that it still refers to the same node.
              if (Editor.hasPath(editor, path)) {
                const lookupNode = Node.get(editor, path)
                if (lookupNode === node) {
                  const start = Editor.start(editor, path)
                  const end = Editor.end(editor, path)

                  const startVoid = Editor.void(editor, { at: start })
                  const endVoid = Editor.void(editor, { at: end })

                  if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
                    const range = Editor.range(editor, start)
                    Transforms.select(editor, range)
                  }
                }
              }
            }
          }}
          onCompositionEnd={(event: CompositionEvent) => {
            if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionEnd)) {
              state.isComposing && setIsComposing(false)
              state.isComposing = false

              // COMPAT: In Chrome, `beforeinput` events for compositions
              // aren't correct and never fire the "insertFromComposition"
              // type that we need. So instead, insert whenever a composition
              // ends since it will already have been committed to the DOM.
              if (!IS_SAFARI && !IS_FIREFOX_LEGACY && !IS_IOS && !IS_QQBROWSER && event.data) {
                Editor.insertText(editor, event.data)
              }

              if (editor.selection && Range.isCollapsed(editor.selection)) {
                const leafPath = editor.selection.anchor.path
                const currentTextNode = Node.leaf(editor, leafPath)
                if (state.hasInsertPrefixInCompositon) {
                  state.hasInsertPrefixInCompositon = false
                  Editor.withoutNormalizing(editor, () => {
                    // remove Unicode BOM prefix added in `onCompositionStart`
                    const text = currentTextNode.text.replace(/^\uFEFF/, '')
                    Transforms.delete(editor, {
                      distance: currentTextNode.text.length,
                      reverse: true
                    })
                    Transforms.insertText(editor, text)
                  })
                }
              }
            }
          }}
          onCompositionUpdate={(event: CompositionEvent) => {
            if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate)) {
              !state.isComposing && setIsComposing(true)
              state.isComposing = true
            }
          }}
          onCompositionStart={(event: CompositionEvent) => {
            if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionStart)) {
              const { selection, marks } = editor
              if (selection) {
                if (Range.isExpanded(selection)) {
                  Editor.deleteFragment(editor)
                  return
                }
                const inline = Editor.above(editor, {
                  match: (n) => Editor.isInline(editor, n),
                  mode: 'highest'
                })
                if (inline) {
                  const [, inlinePath] = inline
                  if (Editor.isEnd(editor, selection.anchor, inlinePath)) {
                    const point = Editor.after(editor, inlinePath)!
                    Transforms.setSelection(editor, {
                      anchor: point,
                      focus: point
                    })
                  }
                }
                // insert new node in advance to ensure composition text will insert
                // along with final input text
                // add Unicode BOM prefix to avoid normalize removing this node
                if (marks) {
                  state.hasInsertPrefixInCompositon = true
                  Transforms.insertNodes(
                    editor,
                    {
                      text: '\uFEFF',
                      ...marks
                    },
                    {
                      select: true
                    }
                  )
                }
              }
            }
          }}
          onCopy={(event: ClipboardEvent) => {
            if (hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy)) {
              event.preventDefault()
              event.clipboardData && ReactEditor.setFragmentData(editor, event.clipboardData)
            }
          }}
          onCut={(event: ClipboardEvent) => {
            if (!readOnly && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut)) {
              event.preventDefault()
              event.clipboardData && ReactEditor.setFragmentData(editor, event.clipboardData)
              const { selection } = editor

              if (selection) {
                if (Range.isExpanded(selection)) {
                  Editor.deleteFragment(editor)
                } else {
                  const node = Node.parent(editor, selection.anchor.path)
                  if (Editor.isVoid(editor, node)) {
                    Transforms.delete(editor)
                  }
                }
              }
            }
          }}
          onDragOver={(event: DragEvent) => {
            if (hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragOver)) {
              // Only when the target is void, call `preventDefault` to signal
              // that drops are allowed. Editable content is droppable by
              // default, and calling `preventDefault` hides the cursor.
              const node = ReactEditor.toSlateNode(editor, event.target)

              if (Editor.isVoid(editor, node)) {
                event.preventDefault()
              }
            }
          }}
          onDragStart={(event: DragEvent) => {
            if (!readOnly && hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragStart)) {
              const node = ReactEditor.toSlateNode(editor, event.target)
              const path = ReactEditor.findPath(editor, node)
              const voidMatch = Editor.isVoid(editor, node) || Editor.void(editor, { at: path, voids: true })

              // If starting a drag on a void node, make sure it is selected
              // so that it shows up in the selection's fragment.
              if (voidMatch) {
                const range = Editor.range(editor, path)
                Transforms.select(editor, range)
              }

              state.isDraggingInternally = true

              event.dataTransfer && ReactEditor.setFragmentData(editor, event.dataTransfer)
            }
          }}
          onDrop={(event: DragEvent) => {
            if (!readOnly && hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDrop)) {
              event.preventDefault()

              // Keep a reference to the dragged range before updating selection
              const draggedRange = editor.selection

              // Find the range where the drop happened
              const range = ReactEditor.findEventRange(editor, event)
              const data = event.dataTransfer

              Transforms.select(editor, range)

              if (state.isDraggingInternally) {
                if (draggedRange) {
                  Transforms.delete(editor, {
                    at: draggedRange
                  })
                }

                state.isDraggingInternally = false
              }

              data && ReactEditor.insertData(editor, data)

              // When dragging from another source into the editor, it's possible
              // that the current editor does not have focus.
              if (!ReactEditor.isFocused(editor)) {
                ReactEditor.focus(editor)
              }
            }
          }}
          onDragEnd={(event: DragEvent) => {
            // When dropping on a different droppable element than the current editor,
            // `onDrop` is not called. So we need to clean up in `onDragEnd` instead.
            // Note: `onDragEnd` is only called when `onDrop` is not called
            if (
              !readOnly &&
              state.isDraggingInternally &&
              hasTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onDragEnd)
            ) {
              state.isDraggingInternally = false
            }
          }}
          onFocus={(event: FocusEvent) => {
            if (
              !readOnly &&
              !state.isUpdatingSelection &&
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onFocus)
            ) {
              const el = ReactEditor.toDOMNode(editor, editor)
              const root = ReactEditor.findDocumentOrShadowRoot(editor)
              state.latestElement = root.activeElement

              // COMPAT: If the editor has nested editable elements, the focus
              // can go to them. In Firefox, this must be prevented because it
              // results in issues with keyboard navigation. (2017/03/30)
              if (IS_FIREFOX && event.target !== el) {
                el.focus()
                return
              }

              IS_FOCUSED.set(editor, true)
            }
          }}
          onKeyDown={(event: KeyboardEvent) => {
            if (
              !readOnly &&
              !state.isComposing &&
              hasEditableTarget(editor, event.target) &&
              !isEventHandled(event, attributes.onKeyDown)
            ) {
              const nativeEvent = event
              const { selection } = editor

              const element = editor.children[selection !== null ? selection.focus.path[0] : 0]
              const isRTL = getDirection(Node.string(element)) === 'rtl'

              // COMPAT: Since we prevent the default behavior on
              // `beforeinput` events, the browser doesn't think there's ever
              // any history stack to undo or redo, so we have to manage these
              // hotkeys ourselves. (2019/11/06)
              if (Hotkeys.isRedo(nativeEvent)) {
                event.preventDefault()
                const maybeHistoryEditor: any = editor

                if (typeof maybeHistoryEditor.redo === 'function') {
                  maybeHistoryEditor.redo()
                }

                return
              }

              if (Hotkeys.isUndo(nativeEvent)) {
                event.preventDefault()
                const maybeHistoryEditor: any = editor

                if (typeof maybeHistoryEditor.undo === 'function') {
                  maybeHistoryEditor.undo()
                }

                return
              }

              // COMPAT: Certain browsers don't handle the selection updates
              // properly. In Chrome, the selection isn't properly extended.
              // And in Firefox, the selection isn't properly collapsed.
              // (2017/10/17)
              if (Hotkeys.isMoveLineBackward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'line', reverse: true })
                return
              }

              if (Hotkeys.isMoveLineForward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'line' })
                return
              }

              if (Hotkeys.isExtendLineBackward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, {
                  unit: 'line',
                  edge: 'focus',
                  reverse: true
                })
                return
              }

              if (Hotkeys.isExtendLineForward(nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, { unit: 'line', edge: 'focus' })
                return
              }

              // COMPAT: If a void node is selected, or a zero-width text node
              // adjacent to an inline is selected, we need to handle these
              // hotkeys manually because browsers won't be able to skip over
              // the void node with the zero-width space not being an empty
              // string.
              if (Hotkeys.isMoveBackward(nativeEvent)) {
                event.preventDefault()

                if (selection && Range.isCollapsed(selection)) {
                  Transforms.move(editor, { reverse: !isRTL })
                } else {
                  Transforms.collapse(editor, { edge: 'start' })
                }

                return
              }

              if (Hotkeys.isMoveForward(nativeEvent)) {
                event.preventDefault()

                if (selection && Range.isCollapsed(selection)) {
                  Transforms.move(editor, { reverse: isRTL })
                } else {
                  Transforms.collapse(editor, { edge: 'end' })
                }

                return
              }

              if (Hotkeys.isMoveWordBackward(nativeEvent)) {
                event.preventDefault()

                if (selection && Range.isExpanded(selection)) {
                  Transforms.collapse(editor, { edge: 'focus' })
                }

                Transforms.move(editor, { unit: 'word', reverse: !isRTL })
                return
              }

              if (Hotkeys.isMoveWordForward(nativeEvent)) {
                event.preventDefault()

                if (selection && Range.isExpanded(selection)) {
                  Transforms.collapse(editor, { edge: 'focus' })
                }

                Transforms.move(editor, { unit: 'word', reverse: isRTL })
                return
              }

              // COMPAT: Certain browsers don't support the `beforeinput` event, so we
              // fall back to guessing at the input intention for hotkeys.
              // COMPAT: In iOS, some of these hotkeys are handled in the
              if (!HAS_BEFORE_INPUT_SUPPORT) {
                // We don't have a core behavior for these, but they change the
                // DOM if we don't prevent them, so we have to.
                if (
                  Hotkeys.isBold(nativeEvent) ||
                  Hotkeys.isItalic(nativeEvent) ||
                  Hotkeys.isTransposeCharacter(nativeEvent)
                ) {
                  event.preventDefault()
                  return
                }

                if (Hotkeys.isSplitBlock(nativeEvent)) {
                  event.preventDefault()
                  Editor.insertBreak(editor)
                  return
                }

                if (Hotkeys.isDeleteBackward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor, { direction: 'backward' })
                  } else {
                    Editor.deleteBackward(editor)
                  }

                  return
                }

                if (Hotkeys.isDeleteForward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor, { direction: 'forward' })
                  } else {
                    Editor.deleteForward(editor)
                  }

                  return
                }

                if (Hotkeys.isDeleteLineBackward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor, { direction: 'backward' })
                  } else {
                    Editor.deleteBackward(editor, { unit: 'line' })
                  }

                  return
                }

                if (Hotkeys.isDeleteLineForward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor, { direction: 'forward' })
                  } else {
                    Editor.deleteForward(editor, { unit: 'line' })
                  }

                  return
                }

                if (Hotkeys.isDeleteWordBackward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor, { direction: 'backward' })
                  } else {
                    Editor.deleteBackward(editor, { unit: 'word' })
                  }

                  return
                }

                if (Hotkeys.isDeleteWordForward(nativeEvent)) {
                  event.preventDefault()

                  if (selection && Range.isExpanded(selection)) {
                    Editor.deleteFragment(editor, { direction: 'forward' })
                  } else {
                    Editor.deleteForward(editor, { unit: 'word' })
                  }

                  return
                }
              } else {
                if (IS_CHROME || IS_SAFARI) {
                  // COMPAT: Chrome and Safari support `beforeinput` event but do not fire
                  // an event when deleting backwards in a selected void inline node
                  if (
                    selection &&
                    (Hotkeys.isDeleteBackward(nativeEvent) || Hotkeys.isDeleteForward(nativeEvent)) &&
                    Range.isCollapsed(selection)
                  ) {
                    const currentNode = Node.parent(editor, selection.anchor.path)

                    if (
                      Element.isElement(currentNode) &&
                      Editor.isVoid(editor, currentNode) &&
                      Editor.isInline(editor, currentNode)
                    ) {
                      event.preventDefault()
                      Editor.deleteBackward(editor, { unit: 'block' })

                      return
                    }
                  }
                }
              }
            }
          }}
          onPaste={(event: ClipboardEvent) => {
            if (!readOnly && hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste)) {
              // COMPAT: Certain browsers don't support the `beforeinput` event, so we
              // fall back to React's `onPaste` here instead.
              // COMPAT: Firefox, Chrome and Safari don't emit `beforeinput` events
              // when "paste without formatting" is used, so fallback. (2020/02/20)
              if (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event)) {
                event.preventDefault()
                event.clipboardData && ReactEditor.insertData(editor, event.clipboardData)
              }
            }
          }}>
          <Children decorations={decorations} node={editor} selection={editor.selection} />
        </Component>
      )
    }
  }
})

type DeferredOperation = () => void

/**
 * The props that get passed to renderPlaceholder
 */
export type RenderPlaceholderProps = {
  attributes: {
    'data-slate-placeholder': boolean
    dir?: 'rtl'
    contentEditable: boolean
    ref: React.Ref
    style: React.CSSProperties
  }
}

/**
 * `RenderElementProps` are passed to the `renderElement` handler.
 */

export interface RenderElementProps {
  // children: any
  element: Element
  attributes: {
    'data-slate-node': 'element'
    'data-slate-inline'?: true
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: any
  }
}

/**
 * `RenderLeafProps` are passed to the `renderLeaf` handler.
 */

export interface RenderLeafProps {
  children: any
  leaf: Text
  text: Text
  attributes: {
    'data-slate-leaf': true
  }
}

/**
 * A default memoized decorate function.
 */

export const defaultDecorate: (entry: NodeEntry) => Range[] = () => []

/**
 * The default placeholder element
 */

export const DefaultPlaceholder = defineComponent({
  props: {
    attributes: Object as PropType<Record<string, any>>
  },
  render() {
    return <span {...this.$props.attributes}>{renderSlot(this.$slots, 'default')}</span>
  }
})

/**
 * A default implement to scroll dom range into view.
 */

const defaultScrollSelectionIntoView = (_: ReactEditor, domRange: DOMRange) => {
  const leafEl = domRange.startContainer.parentElement!
  leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(domRange)
  scrollIntoView(leafEl, {
    scrollMode: 'if-needed'
  })

  // @ts-ignore
  delete leafEl.getBoundingClientRect
}

/**
 * Check if the target is editable and in the editor.
 */

export const hasEditableTarget = (editor: ReactEditor, target: EventTarget | null): target is DOMNode => {
  return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target, { editable: true })
}

type ElementType<P = any> = {
  [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
}[keyof JSX.IntrinsicElements]

/**
 * Check if a DOM event is overrided by a handler.
 */

export const isDOMEventHandled = <E extends Event>(event: E, handler?: (event: E) => void | boolean) => {
  if (!handler) {
    return false
  }

  // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.
  const shouldTreatEventAsHandled = handler(event)

  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled
  }

  return event.defaultPrevented
}

/**
 * Check if the target is in the editor.
 */

export const hasTarget = (editor: ReactEditor, target: EventTarget | null): target is DOMNode => {
  return isDOMNode(target) && ReactEditor.hasDOMNode(editor, target)
}

/**
 * Check if the target is inside void and in the editor.
 */

export const isTargetInsideVoid = (editor: ReactEditor, target: EventTarget | null): boolean => {
  const slateNode = hasTarget(editor, target) && ReactEditor.toSlateNode(editor, target)
  return Editor.isVoid(editor, slateNode)
}

/**
 * Check if an event is overrided by a handler.
 */

export const isEventHandled = <EventType extends Event>(
  event: EventType,
  handler?: (event: EventType) => void | boolean
) => {
  if (!handler) {
    return false
  }
  // The custom event handler may return a boolean to specify whether the event
  // shall be treated as being handled or not.
  const shouldTreatEventAsHandled = handler(event)

  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled
  }

  return event.defaultPrevented
  //TODO: What's isPropagationStopped ?
  // return event.isDefaultPrevented() || event.isPropagationStopped()
}

<h1 align="center">WIP</h1>


## Examples

See all examples in [online example](https://shiyiya.github.io/slate-vue-alpha/).

- jsx render props VS vue render slot

```jsx
// jsx
const editor = () => (
  <Slate>
    <Editor
      renderLeaf={props => <Element {...props} />}
      renderElement={props => <Leaf {...props} />}
    />
  </Slate>
)
```

- template

```vue
<template>
  <Slate>
    <Editor>
      <template v-slot:elment/>
      <template v-slot:leaf/>
    </Editor>
  </Slate>
</template>
```

# Slate-vue-alpha

[![Build Status](https://img.shields.io/github/workflow/status/marsprince/slate-vue/Test)](https://github.com/marsprince/slate-vue/actions?query=workflow%3ATest)
[![NPM Version](https://img.shields.io/npm/v/slate-vue?color=brightgreen)](https://www.npmjs.com/package/slate-vue)
[![NPM Size](https://img.shields.io/badge/gzip-36kb-brightgreen)](https://unpkg.com/slate-vue/dist/index.es.js)

An implement for [slate](https://github.com/ianstormtaylor/slate) supported `vue3`（in development）. Most of the
slate-react's components can be easily migrated by no code change.

All slate-react's example is supported now.

For principles's question, Please read slate's [docs](https://docs.slatejs.org/) first!

## Install

in npm

```shell
npm install slate-vue
```

in yarn

```shell
yarn add slate-vue
```

## Usage

import

```javascript
import Vue from 'vue'
import { SlatePlugin } from 'slate-vue';

Vue.use(SlatePlugin)
```

use

```vue

<template>
  <Slate :value="value">
    <Editable placeholder="Enter some plain text..."></Editable>
  </Slate>
</template>

<script>
import { Slate, Editable } from 'slate-vue'

// this value is for editor
const initialValue = [
  {
    children: [
      { text: 'This is editable plain text, just like a <textarea>!' },
    ],
  },
]
export default {
  name: 'index',
  components: {
    Slate,
    Editable
  },
  data () {
    return {
      value: JSON.stringify(initialValue)
    }
  }
};
</script>
```

## Examples

See all examples in [online example](https://marsprince.github.io/slate-vue).

See all example code in [pages](https://github.com/marsprince/slate-vue/tree/master/site/pages)

## Issues

You can use this [codesandbox template](https://codesandbox.io/s/2984l) to reproduce problems.

## Environment Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari |
| --- | --- | --- | --- |
| testing | testing | 86.0+ | testing |

## License

[MIT](LICENSE) © marsprince

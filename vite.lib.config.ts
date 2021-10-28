import { common } from './vite.site.config'
import path from 'path'

common.build = {
  ...common.build,
  outDir: 'lib',
  lib: {
    entry: path.resolve(__dirname, 'src/index.ts'),
    name: 'slate-vue'
  }
}
export default common

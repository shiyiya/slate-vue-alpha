import { createApp } from 'vue'
import App from './app'
// import Editor from './editor.vue'

// const Main = {
//   setup() {
//     const index = ref(true)
//     return () => (
//       <>
//         <p onClick={() => (index.value = !index.value)}>toggle {index.value ? 'vue' : 'jsx'} </p>
//         <hr />
//         {index.value ? <Editor /> : <App />}
//       </>
//     )
//   }
// }

createApp(App).mount('#app')

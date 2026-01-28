import { mount } from 'svelte'
import './app.css'
// @ts-ignore - Svelte component import
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app

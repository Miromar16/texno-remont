import { createApp } from 'vue'
import App from './App.vue'
import ServicePage from './ServicePage.vue'
import './style.css'

const pageType = document.body.dataset.page
createApp(pageType ? ServicePage : App).mount('#app')

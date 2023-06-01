import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faGlobe,faClock } from '@fortawesome/free-solid-svg-icons'


library.add(faTrashCan,faGlobe,faClock)

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App).use(vuetify).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
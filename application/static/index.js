
import router from './router.js';
// import Navbar from './components/Navbar.js';
import NewNavbar from './components/NewNavbar.js';
import store from './store.js'

// Navigation gaurd
// PROBLEM HERE!!! isAuthenticated not getting updated 
// const isAuthenticated = localStorage.getItem('auth-token') ? true : false

// router.beforeEach((to, from, next) => {
//     if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
//     else next()
//   })



const app = new Vue({
    el: "#app",
    template: `
        <div>
        <NewNavbar></NewNavbar>
        <router-view></router-view>
        </div>`,
    router,
    store
});


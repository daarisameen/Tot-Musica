// import {createRouter, createWebHistory} from 'vue-router';

import LandingPage from './components/landing_page.js' 
import NewLogin from './components/NewLogin.js'
import NewRegister from './components/NewRegister.js'
import NewHome from './components/NewHome.js'
import UploadSong from './components/UploadSong.js'
import PlaySong from './components/PlaySong.js'
import UpdateSong from './components/UpdateSong.js'
import YourPlaylists from './components/YourPlaylists.js'
import CreatePlaylist from './components/CreatePlaylist.js'
import ViewPlaylist from './components/ViewPlaylist.js'
import UpdatePlaylist from './components/UpdatePlaylist.js'
import AdminDashboard from './components/AdminDashboard.js'
import CreatorDashboard from './components/CreatorDashboard.js'
import CreateAlbum from './components/CreateAlbum.js'
import ViewAlbum from './components/ViewAlbum.js'
import UpdateAlbum from './components/UpdateAlbum.js'
import CreatorRegistration from './components/CreatorRegistration.js'




const routes = [
        {
            path: '/',
            component: LandingPage,
            name: "Landing Page"
        },
        {
            path: '/login',
            component: NewLogin,
            name: "Login"
        },
        {
            path: '/register',
            component: NewRegister,
            name: "Register"
        },
        {
            path: '/userhome',
            component: NewHome,
            name: "Home"
        },
        {
            path: '/upload-song',
            component: UploadSong,
            name: "Upload Song"
        },
        {
            path: '/play-song/:id',
            component: PlaySong,
            name: "Play Song"
        },
        {
            path: '/update-song/:id',
            component: UpdateSong,
            name: "Update Song"
        },
        {
            path: '/your-playlists',
            component: YourPlaylists,
            name: "Your Playlists"
        },
        {
            path: '/create-playlist',
            component: CreatePlaylist,
            name: "Create Playlist"
        },
        {
            path: '/view-playlist/:id',
            component: ViewPlaylist,
            name: "View Playlist"
        },
        {
            path: '/update-playlist/:id',
            component: UpdatePlaylist,
            name: "Update Playlist"
        },
        {
            path: '/admin-dashboard',
            component: AdminDashboard,
            name: "Admin Dashboard"
        },
        {
            path: '/creator-dashboard',
            component: CreatorDashboard,
            name: "Creator Dashboard"
        },
        {
            path: '/create-album',
            component: CreateAlbum,
            name: "Create Album"
        },
        {
            path: '/view-album/:id',
            component: ViewAlbum,
            name: "View Album"
        },
        {
            path: '/update-album/:id',
            component: UpdateAlbum,
            name: "Update Album"
        },
        {
            path: '/creator-registration',
            component: CreatorRegistration,
            name: "Creator Registration"
        },

    ];



const router = new VueRouter({
    // history: createWebHistory(),
    routes
});


export default router;
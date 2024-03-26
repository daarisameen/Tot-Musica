export default new Vuex.Store ({
    state () {
      return {
        authenticated: false
      }
    },
    mutations: {
        setAuthenticated(state, value) {
            state.authenticated = value;
        },
    }
  })


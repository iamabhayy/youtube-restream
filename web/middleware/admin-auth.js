export default function ({ store, redirect }) {
    if (!store.getters.isAuthenticated) {
      redirect('/login')
    } else if (store.getters.isAuthenticated && store.state.user.role != 'admin'){
        redirect('/admin/dashboard')
    }
  }
export default {
    methods: {
        async logout() {
          try {
            const token = localStorage.getItem('access-token');
    
            const res = await fetch('/api/signout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
    
            if (res.ok) {
              console.log('User logged out successfully');
              // Clear the access token from local storage
              localStorage.removeItem('access-token');
              this.$router.push({ path: '/' });
            } else {
              const data = await res.json();
              console.error('Logout failed', data.message);
            }
          } catch (error) {
            console.error('Error during logout', error);
          }
        },
      }
}
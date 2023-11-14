new Vue({
  el: '#app',
  data: {
    isFollowing: false,
  },
  methods: {
    toggleFollow() {
      this.isFollowing = !this.isFollowing
    },
  },
})

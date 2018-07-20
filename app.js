App({
  globalData: {
    canApp: false,
    media: {},
    mediaList: [],
  },
  getMedia(index) {
    return this.globalData.media
  },
  setMedia(media) {
    this.globalData.media = media
  },
  addMedia(media) {
    this.setMedia(media)
    this.globalData.mediaList.unshift(media)
  },
  getMediaList() {
    return this.globalData.mediaList
  },
  onShow({ scene }) {
    if (1036 === scene) {
      this.globalData.canApp = true
    }
    if (!/1036|1089|1090/.test(scene)) {
      this.globalData.canApp = false
    }
  }
})

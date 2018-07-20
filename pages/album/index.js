const { setMedia, addMedia, getMediaList } = getApp();

Page({
  data: {
    mediaList: null,
    picking: false,
    taking: false,
  },
  onShow() {
    this.setData({ mediaList: getMediaList() })
  },
  prevent(event) {
    event.preventDefault()
  },
  preview(event) {
    let index = event.currentTarget.dataset.index
    let media = this.data.mediaList[index]
    wx.previewImage({
      current: media.image,
      urls: this.data.mediaList.map(({ image }) => image)
    })
  },
  setMedia(type, res) {
    let media = null;
    switch (type) {
      case 'photo':
        media = { type, image: res.tempImagePath }
        break
      case 'video':
        media = { type, image: res.tempThumbPath, video: res.tempVideoPath }
        break
    }
    this.setData({ src: media.image })
    addMedia(media)
    this.onShow()
  },
  chooseImage() {
    this.setData({ picking: true })
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['camera'/*, 'album'*/],
      success: (res) => {
        this.setMedia('photo', { tempImagePath: res.tempFilePaths[0] })
      },
      complete: (res) => {
        this.setData({ picking: false })
      }
    })
  },
  chooseVideo() {
    this.setData({ taking: true })
    wx.chooseVideo({
      sourceType: ['camera', 'album'],
      compressed: false,
      success: (res) => {
        this.setMedia('video', { tempVideoPath: res.tempFilePath })
      },
      complete: (res) => {
        this.setData({ taking: false })
      }
    })
  },
  error(e) {
    wx.showModal({
      title: '发生错误',
      content: e.detail.errMsg
    })
  }
})

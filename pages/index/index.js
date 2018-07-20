const { globalData, addMedia } = getApp();

const flashs =  [
  { label: '自动', value: 'auto' },
  { label: '开', value: 'on' },
  { label: '关', value: 'off' }
]
const qualitys =  [
  { label: '低', value: 'low' },
  { label: '中', value: 'normal' },
  { label: '高', value: 'high' }
]
const modes =  [
  { label: '相片', value: 'photo' },
  { label: 'video', value: 'video' },
  { label: 'record', value: 'record' }
]
const filters =  [
  { label: '默认', value: 0 },
  { label: '褐色', value: 1 },
  { label: '黑白', value: 2 },
  { label: '反色', value: 3 },
  { label: '鲜艳', value: 4 },
  { label: '蓝色', value: 5 }
]

Page({
  data: {
    canApp: false,
    flash: flashs[0],
    quality: qualitys[1],
    mode: modes[0],
    filter: filters[0],
    position: "back",
    type: "photo",
    timer: 0,
    shooting: false,
    recording: false,
    preview: '',
    filePath: '',
  },

  onLoad() {
    this.ctx = wx.createCameraContext()
  },
  onShow() {
    this.setData({ canApp: globalData.canApp })
  },

  startTimer() {
    this.setData({ recording: true })
    setInterval(() => {
      this.setData({ timer: this.data.timer + 1 })
    }, 1000)
  },
  stopTimer() {
    this.setData({ recording: false, timer: 0 })
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
    this.setData({ preview: media.image })
    addMedia(media)
  },

  changeQuality(event) {
    this.setData({ quality: event.detail.value })
  },
  changeType(event) {
    this.setData({ type: event.currentTarget.dataset.type })
  },
  switchFlash() {
    wx.showActionSheet({
      itemList: flashs.map(({ label }) => label),
      success: ({ tapIndex }) => {
        this.setData({ flash: flashs[tapIndex] })
      }
    })
  },
  switchCamera() {
    this.setData({ position: this.data.position === 'back' ? 'front' : 'back' })
  },
  switchQuality() {
    wx.showActionSheet({
      itemList: qualitys.map(({ label }) => label),
      success: ({ tapIndex }) => {
        this.setData({ quality: qualitys[tapIndex] })
      }
    })
  },
  switchMode() {
    wx.showActionSheet({
      itemList: modes.map(({ label }) => label),
      success: ({ tapIndex }) => {
        this.setData({ mode: modes[tapIndex] })
      }
    })
  },
  switchFilter() {
    wx.showActionSheet({
      itemList: filters.map(({ label }) => label),
      success: ({ tapIndex }) => {
        this.setData({ filter: filters[tapIndex] })
      }
    })
  },
  cameraOutput(event) {
    console.log(event)
  },

  shoot() {
    switch (this.data.type) {
      case 'photo':
        this.takePhoto();
        break;
      case 'video':
        this.data.recording ? this.stopRecord() : this.startRecord();
        break;
    }
  },
  takePhoto() {
    this.setData({ shooting: true })
    this.ctx.takePhoto({
      quality: this.data.quality,
      success: (res) => {
        wx.showToast({ title: '拍摄成功', icon: 'success' })
        this.setMedia('photo', res)
      },
      fail: (res) => {
        wx.showModal({ title: '拍摄失败', content: res.errMsg })
      },
      complete: () => {
        this.setData({ shooting: false })
      }
    })
  },
  startRecord() {
    this.setData({ shooting: true })
    this.ctx.startRecord({
      quality: this.data.quality,
      success: (res) => {
        this.startTimer()
      },
      fail: (res) => {
        this.stopTimer()
        wx.showModal({ title: '录像失败', content: res.errMsg })
      },
      complete: () => {
        this.setData({ shooting: false })
      },
      timeoutCallback: (res) => {
        this.stopTimer()
        this.setMedia('video', res)
        wx.showToast({ title: '录像超时（已保存）', icon: 'success' })
      }
    })
  },
  stopRecord() {
    this.setData({ shooting: true })
    this.stopTimer()
    this.ctx.stopRecord({
      success: (res) => {
        this.setMedia('video', res)
        wx.showToast({ title: '录像成功', icon: 'success' })
      },
      fail: (res) => {
        wx.showModal({ title: '停止失败', constent: res.errMsg })
      },
      complete: () => {
        this.setData({ shooting: false })
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

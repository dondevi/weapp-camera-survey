const { getMedia } = getApp();

Page({
  data: {
    image: '',
    video: '',
    info: {},
    filePath: '',
    uploading: false,
  },
  onShow() {
    let { image, video = '' } = getMedia()
    wx.getImageInfo({
      src: image,
      success: (res) => {
        this.setData({ info: res })
      }
    })
    this.setData({ image, video, filePath: video || image })
  },
  uploadFile() {
    this.setData({ uploading: true })
    wx.showLoading({ title: '上传中' })
    wx.uploadFile({
      url: '',
      filePath: this.data.filePath,
      name: 'file',
      success: (res) => {
        const json = JSON.parse(res.data)
        if (json.success) {
          wx.showModal({ title: '上传成功', content: json.data.files[0] })
        } else {
          wx.showModal({ title: '上传失败', content: JSON.stringify(json) })
        }
      },
      fail: (res) => {
        wx.showModal({ title: '上传失败', content: res.errMsg })
      },
      complete: () => {
        wx.hideLoading()
        this.setData({ uploading: false })
      }
    })
  },
  error(e) {
    wx.showModal({
      title: '发生错误',
      content: e.detail.errMsg
    })
  },
});

# 微信小程序相机能力调研
> 2018-05-07 dondevi

<br>

## 一、小程序限制
- 代码大小 ≤ 2 M
- 页面跳转 ≤ 5 次
- 必须用 HTTPS
- 通信对微信透明

<br>

## 二、候选方案

### 1. 相机组件 <kbd>基础库 ≥ 1.6.0</kbd>
> 分辨率低

1.1. [&lt;camera&gt;](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)

- 控制前/后置摄像头: `device-position` - [back, front]
- 控制闪光灯: `flash` - [auto, on, off]

1.2. [wx.createCameraContext()](https://developers.weixin.qq.com/miniprogram/dev/api/api-camera.html)

- 拍照: `takePhoto()` - 质量 [normal: 0.7, high: 1, low: 0.3]
- 录像: `startRecord()` / `stopRecord()` - 30 秒超时

### 2. 选择相片或视频
> 不能防篡改

2.1. [wx.chooseImage()](https://developers.weixin.qq.com/miniprogram/dev/api/media-picture.html)

- 来源: `sourceType` - [album: 相册, camera: 相机]
- 质量: `sizeType` - [original: 原图, compressed: 压缩图]

2.2. [wx.chooseVideo()](https://developers.weixin.qq.com/miniprogram/dev/api/media-video.html#wxchoosevideoobject)
> 60 秒超时

- 来源: `sourceType` - [album: 相册, camera: 相机]
- 质量: `compressed` - [true: 压缩]

### 3. 打开 APP <kbd>微信 ≥ 6.5.6</kbd>
> 只能打开作为分享来源的 APP

3.1. [wx.launchApp()](https://developers.weixin.qq.com/miniprogram/dev/api/launchApp.html)

<br><br>

## 三、技术分析

### 1. 二维码内容

```shell
  # 开发版 (临时)
  https://mp.weixin.qq.com/a/~~fFXpK_PSMhc~jAVvjs3TS5pZUpuulD33Qw~~

  # 体验版
  https://open.weixin.qq.com/sns/getexpappinfo?appid=${appId}&path=index%2Findex.html#wechat-redirect
  # (重定向后)
  https://open.weixin.qq.com/sns/getexpappinfo?appid=${appId}&path=index%2Findex.html&key=dbce4ff2db368b61229aafa9881c01344f706f5da2b554907bb5bc72930d5fca967527205c94cd2691e90ab401f42f6d13f9a321b5a02592db04a6c6574e062eea6761c4a2f3996c127a230bc25eedc8&uin=MTM5ODAwMDMyMA%3D%3D&scene=1&version=16060622&pass_ticket=OoyRLy8v8smWFyhVPIZCTRzkJSCczf90FpaWyyUcglkdbHTGygY9lkQgu30lrUtt

  # 正式版
  https://mp.weixin.qq.com/a/~~wu3hXzBSt64~plUyoOB9Iyf8mEHP9BrkLA~~
  # (旧版)
  https://mp.weixin.qq.com/a/3iooZ6KLUI4t2rLXg_B0?v=3

```


### 2. 打开小程序
> 以体验版为例

#### 2.1 GET 请求
```
  https://open.weixin.qq.com/sns/launchapp?appid=${appId}&amp;uin=MTM5ODAwMDMyMA==&amp;key=dbce4ff2db368b61229aafa9881c01344f706f5da2b554907bb5bc72930d5fca967527205c94cd2691e90ab401f42f6d13f9a321b5a02592db04a6c6574e062eea6761c4a2f3996c127a230bc25eedc8&amp;pass_ticket=OoyRLy8v8smWFyhVPIZCTRzkJSCczf90FpaWyyUcglkdbHTGygY9lkQgu30lrUtt
```
```json
  {
    "userName": "gh_f0fa84a6c68e@app",
    "appId": "${appId}",
    "scene": 1001,
    "downloadURL": "https:\/\/servicewechat.com\/weapp-test\/experience\/wk-Vcng2Ya-b8P-F_RrtWRZaRAQtvRF480iYAdOopYY",
    "openType": 2,
    "checkSumMd5": "21dfb9847ceb51d726a2361bd3823077",
    "retcode": 0,
    "extJsonInfo": "{\"module_list\":[],\"device_orientation\":\"\"}"
  }
```

#### 2.2 打开小程序
```js
  WeixinJSBridge.invoke("openWeApp", {
    "userName": res.userName,
    "appId": res.appId,
    "downloadURL": res.downloadURL,
    "openType": res.openType,
    "checkSumMd5": res.checkSumMd5,
    "appVersion": 0,
    "scene": 1017,
    "relativeURL": relativeURL.html(false),
    "extJsonInfo": res.extJsonInfo
  });
```

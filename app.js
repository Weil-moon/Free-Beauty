// ============================================================
// app.js - 全局逻辑
// ============================================================
// 文件路径: app.js

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({ traceUser: true })
    }
  },
  globalData: {
    userInfo: null,
    preferences: []
  }
})


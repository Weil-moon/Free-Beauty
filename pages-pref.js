// ============================================================
// pages/pref/pref.js - 偏好选择页逻辑
// ============================================================
// 文件路径: pages/pref/pref.js

const db = wx.cloud.database()

Page({
  data: {
    selected: [],
    options: [
      { id: 'ui', emoji: '🖼', label: '优秀界面', desc: '看看别人怎么做好看的设计' },
      { id: 'color', emoji: '🎨', label: '配色灵感', desc: '一组颜色，三个字' },
      { id: 'music', emoji: '🎵', label: '背景音乐', desc: '什么都不用做，只是听' }
    ]
  },

  toggle(e) {
    const id = e.currentTarget.dataset.id
    let selected = [...this.data.selected]
    const idx = selected.indexOf(id)
    if (idx > -1) {
      selected.splice(idx, 1)
    } else {
      selected.push(id)
    }
    this.setData({ selected })
  },

  async confirm() {
    if (this.data.selected.length === 0) {
      wx.showToast({ title: '至少选一个吧', icon: 'none' })
      return
    }
    const openid = wx.getStorageSync('openid')
    await db.collection('users').add({
      data: {
        openid,
        preferences: this.data.selected,
        created_at: new Date()
      }
    })
    wx.setStorageSync('preferences', this.data.selected)
    wx.redirectTo({ url: '/pages/index/index' })
  }
})
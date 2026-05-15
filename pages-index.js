const UNSPLASH_KEY = 'YOUR_KEY'
const queries = [
  'still light interior',
  'calm everyday handmade',
  'chinese ink landscape',
  'persian architecture detail',
  'african textile pattern',
  'latin street quiet moment',
  'india morning ritual',
  'nordic forest breath'
]

// 备用图片库（上传到云存储后替换链接）
const fallbackImages = [
  { image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', note: '' },
  { image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', note: '' },
  { image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800', note: '' },
]

const notes = {
  aesthetic: [
    '美是邂逅所得，不是占有所得。——杜威',
    '不完整，才是完整的另一种形式。——九鬼周造',
    '眼睛是灵魂的窗，皮肤是世界的入口。——梅洛-庞蒂',
    '凝视一朵花足够长，它会告诉你一切。——欧姬芙',
    '真正的颜色只在光线将息时显现。——拉斯金',
    '留白不是空，是呼吸的地方。——宗白华',
    '美在于它从不重复自己。——博尔赫斯',
    '手触泥土时，人才知道自己存在。——非洲陶艺谚语',
  ],
  philosophy: [
    '人不能两次踏入同一条河流。——赫拉克利特',
    '诸行无常，是生灭法。——大般涅槃经',
    '花未眠，所以我注视它。——川端康成',
    '万物并作，吾以观复。——老子',
    '时间是个圆，不是直线。——鲁米',
    '我们拥有的，不过是此刻。——马可·奥勒留',
    '沙漠教人知道，一切都会过去。——图阿雷格谚语',
    '树叶落下，树并不悲伤。——泰戈尔',
  ],
  sociology: [
    '漫游者没有目的地，只有此刻的街道。——本雅明',
    '我在人群中，但不属于人群。——波德莱尔',
    '城市是人类最复杂的发明。——齐美尔',
    '日常生活是一门被忽视的艺术。——德塞托',
    '慢走的人才看得见缝隙里的光。——马尔克斯',
    '我是过客，但这条路因我而存在。——纪伯伦',
    '停下来，才知道自己去过哪里。——Ubuntu哲学',
    '间隙是城市真正的居所。——雅各布斯',
  ],
  literature: [
    '沉默是另一种语言。——保罗·策兰',
    '写作是屏住呼吸，然后慢慢吐出。——村上春树',
    '有些话要在夜里才说得出口。——张爱玲',
    '诗是从呼吸的缝隙里漏出来的。——聂鲁达',
    '每一次停顿都是一次选择。——托妮·莫里森',
    '语言之外，还有语言。——维特根斯坦',
    '风吹过草原，那也是一首诗。——法拉赫',
    '呼吸是身体记住活着这件事的方式。——苏菲·卡勒',
  ]
}

const allNotes = Object.values(notes).flat()

function randomNote() {
  return allNotes[Math.floor(Math.random() * allNotes.length)]
}

function randomFallback() {
  const item = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
  return { ...item, note: randomNote() }
}

const contents = {
  color: [
    { id: 1, palette: ['#F5E6D3', '#C4956A', '#2C3E50'], label: '秋日暖' },
    { id: 2, palette: ['#1A1A2E', '#16213E', '#0F3460', '#E94560'], label: '深夜蓝' },
    { id: 3, palette: ['#F8F9FA', '#E9ECEF', '#ADB5BD', '#495057'], label: '烟雨灰' },
  ],
  music: [
    { id: 1, name: 'Gymnopédie No.1', artist: 'Erik Satie', url: '' },
    { id: 2, name: 'Rainy Afternoon', artist: 'Pixabay', url: '' },
  ]
}

let audioCtx = null

Page({
  data: {
    preferences: [],
    currentType: 'ui',
    currentItem: null,
    timerMinutes: 0,
    timerRunning: false,
    timerLeft: 0,
    showTimer: false,
    timerOptions: [3, 5, 10]
  },

  onLoad() {
    const preferences = wx.getStorageSync('preferences') || []
    if (preferences.length === 0) {
      wx.redirectTo({ url: '/pages/pref/pref' })
      return
    }
    this.setData({ preferences, currentType: preferences[0] })
    this.loadNext()
  },

  loadNext() {
    const type = this.data.currentType
    if (type === 'ui') {
      wx.request({
        url: 'https://api.unsplash.com/photos/random',
        data: { 
          query: queries[Math.floor(Math.random() * queries.length)], 
          orientation: 'portrait' 
        },
        header: { 'Authorization': 'Client-ID ' + UNSPLASH_KEY },
        timeout: 8000,
        success: (res) => {
          if (res.data && res.data.urls) {
            this.setData({
              currentItem: {
                image_url: res.data.urls.regular,
                note: randomNote()
              }
            })
          } else {
            this.setData({ currentItem: randomFallback() })
          }
        },
        fail: () => {
          // 请求失败，使用备用图片
          this.setData({ currentItem: randomFallback() })
        }
      })
    } else {
      const pool = contents[type]
      const item = pool[Math.floor(Math.random() * pool.length)]
      this.setData({ currentItem: item })
    }
  },

  playMusic(url) {
    if (audioCtx) { audioCtx.stop(); audioCtx.destroy() }
    audioCtx = wx.createInnerAudioContext()
    audioCtx.src = url
    audioCtx.play()
  },

  toggleMusic() {
    if (!audioCtx) return
    audioCtx.paused ? audioCtx.play() : audioCtx.pause()
  },

  touchStart(e) {
    this._startY = e.touches[0].clientY
  },

  touchEnd(e) {
    const diff = this._startY - e.changedTouches[0].clientY
    if (diff > 60) this.loadNext()
  },

  switchType() {
    const prefs = this.data.preferences
    const idx = prefs.indexOf(this.data.currentType)
    const next = prefs[(idx + 1) % prefs.length]
    this.setData({ currentType: next })
    this.loadNext()
  },

  openTimer() { this.setData({ showTimer: true }) },
  closeTimer() { this.setData({ showTimer: false }) },

  startTimer(e) {
    const minutes = e.currentTarget.dataset.min
    this.setData({ timerMinutes: minutes, timerLeft: minutes * 60, timerRunning: true, showTimer: false })
    this.countdown()
  },

  countdown() {
    if (!this.data.timerRunning) return
    if (this.data.timerLeft <= 0) {
      wx.vibrateLong()
      wx.showToast({ title: '该回去看看了 👀', icon: 'none', duration: 3000 })
      this.setData({ timerRunning: false })
      return
    }
    setTimeout(() => {
      this.setData({ timerLeft: this.data.timerLeft - 1 })
      this.countdown()
    }, 1000)
  },

  onUnload() {
    if (audioCtx) { audioCtx.stop(); audioCtx.destroy() }
  }
})
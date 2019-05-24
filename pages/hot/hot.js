const app = getApp();
Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
    title:'热点'
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})
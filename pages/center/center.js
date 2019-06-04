//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    iconList:[
      {
        icon:'likefill',
        color:'red',
        name:'收藏',
        link:'collect'
      },
      {
        icon:'tagfill',
        color:'cyan',
        name:'标签',
        link:'tag'
      },
      {
        icon:'timefill',
        color:'mauve',
        name:'历史',
        link:'history'
      }
    ],
    size:['xs','sm','dm','lg','xl',' '],
    color:['red','orange','yellow','olive','green','cyan','blue','purple','mauve','pink','brown','grey','black','white','gray'],
    bt_size:['sm',' ','lg']
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow(){
    wx.request({
      url: 'https://sv.icewhite.cn:9301/user_tags',
      method:"POST",
      data:{
        userid:app.globalData.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success:res=>{
        this.setData({
          tags:res.data.user_tags
        })
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  totag:function(){
    wx.navigateTo({
      url:'../tag/tag'
    })
  },
  tohistory:function(){
    wx.navigateTo({
      url:'../history/history'
    })
  },
  tocollect:function(){
    wx.navigateTo({
      url:'../collect/collect'
    })
  },
  getRandomNum() {
    var min = 1//这里改成你需要的最小值
    var max = 100//这里改成你需要的最大值
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  test(){
    return 123
  }
})

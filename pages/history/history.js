const app = getApp();

var utils = require('../../utils/util.js');

Page({
  data: {
    list:[],
    showList:{},
    fragment:0,
    finallList:{},
    
  },
  onLoad(){
    var that = this;
    wx.request({
      url: 'https://sv.icewhite.cn:9301/browser_history',
      data: {
        userid: app.globalData.openId,
        fragment: this.data.fragment
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res){
        that.setData({
          list:res.data.result
        })
        console.log(that.data.list)
        let array = []


        for(var i=0;i<that.data.list.length;i++){

          that.data.list[i]['time'] = utils.formatTime(that.data.list[i].op_time,"h:m")

          if(i!=0){
            if(utils.formatTime(that.data.list[i].op_time,"M-D")==utils.formatTime(that.data.list[i-1].op_time,"M-D")){
              array.push(that.data.list[i])
            }
            else{
              array = []
              array.push(that.data.list[i])
            }
            that.data.showList[utils.formatTime(that.data.list[i].op_time,"M-D")]=array
          }
          else{
            array.push(that.data.list[i])
            that.data.showList[utils.formatTime(that.data.list[i].op_time,"M-D")]=array
            console.log(i=0)
          }
        }


        that.setData({
          finallList:that.data.showList
        })
        console.log(that.data.finallList)
      }
    });

  },
  toarticle(e){
    
    let id =escape(JSON.stringify( e.currentTarget.dataset.obj));
    console.log(id)
    wx.navigateTo({
      url:'../article/article?item='+id
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
});
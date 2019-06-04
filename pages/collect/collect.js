const app = getApp();

var utils = require('../../utils/util.js');
Page({
  data: {
    list:[],
    fragment:0,
    isLoading:false,
    isNone:false,
    fragment:0
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://sv.icewhite.cn:9301/user_collections',
      data: {
        userid:app.globalData.openId,
        fragment:that.data.fragment
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res){
        if(res.statusCode == 400){
          wx.showToast({
            title:'获取收藏列表失败',
            icon:'none'
          })
        }
        else{
          that.setData({
            list:res.data.result
          });
          for(var i = 0;i<that.data.list.length;i++){
            that.data.list[i]['time'] = utils.formatTime(that.data.list[i].op_time,'M-D h:m')
          }
          that.setData({
            searchresult :   that.data.list
          })
          console.log(that.data.searchresult)
        }
      }
    });
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
    if (this.data.ListTouchDirection == 'left') {
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
  cancelcollection(e){
    var that =this
    let id = e.currentTarget.dataset.obj
    console.log(id)
    wx.request({
      url: 'https://sv.icewhite.cn:9301/cancel_star_page',
      data: {
        userid:app.globalData.openId,
        pageid:id
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res){
        
        if(res.statusCode == 400){
          wx.showToast({
            title:'取消失败！',
            icon:'none'
          })
        }
        else{
          wx.request({
            url: 'https://sv.icewhite.cn:9301/user_collections',
            data: {
              userid:app.globalData.openId,
              fragment:that.data.fragment
            },
            method:"POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            success(res){
              if(res.statusCode == 400){
                wx.showToast({
                  title:'获取收藏列表失败',
                  icon:'none'
                })
              }
              else{
                that.setData({
                  list:res.data.result
                });
                for(var i = 0;i<that.data.list.length;i++){
                  that.data.list[i]['time'] = utils.formatTime(that.data.list[i].op_time,'M-D h:m')
                }
                that.setData({
                  searchresult :   that.data.list
                })
                console.log(that.data.searchresult)
              }
            }
          });
        }
      }
    });
  },
  toarticle(e){
    let item = escape(JSON.stringify(e.currentTarget.dataset.obj))
    console.log(item)
    wx.navigateTo({
      url:'../article/article?item='+item
    })
  },
  onReachBottom(){
    var that = this;
    this.data.fragment++;
    this.setData({
      isLoading:true
    })
    wx.request({
      url: 'https://sv.icewhite.cn:9301/page_key_search',
      data: {
        key: that.data.searchvalue,
        fragment: that.data.fragment
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success(res){
        if(res.statusCode == 400){
          that.setData({
            isNone:true
          })
          console.log(that.data.isLoading)
        }
        else{
          let list = that.data.searchresult;
          for(var i=0;i<res.data.result.length;i++){
            list.push(res.data.result[i])
          }
          that.setData({
            searchresult:list,
            isLoading:false
          })
          console.log(that.data.searchresult)
        }
      }
    })
  },
});
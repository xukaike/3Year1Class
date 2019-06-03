const app = getApp();

var utils = require('../../utils/util.js');

Page({
  data: {
    list:[],
    showList:{},
    fragment:0,
    finallList:{},
    showModal:false,
    deleteid:''
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
        postList(that, res);
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
  showModal(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    this.setData({
      showModal:true,
      deleteid:id
    })
  },
  hideModal(){
    this.setData({
      showModal:false
    })
  },
  delete(){
    var that = this;
    wx.request({
      url:'https://sv.icewhite.cn:9301/delete_history',
      data: {
        userid: app.globalData.openId,
        pageid: this.data.deleteid
      },
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      success:res=>{
        if(res.statusCode == 400){
          wx.showToast({
            title:"删除失败",
            icon:'none'
          })
        }
        else{
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
                list: res.data.result
              });
              console.log(that.data.list);
              let array = [];
              for (var i = 0; i < that.data.list.length; i++) {
                that.data.list[i]['time'] = utils.formatTime(that.data.list[i].op_time, "h:m");
                if (i != 0) {
                  if (utils.formatTime(that.data.list[i].op_time, "M-D") == utils.formatTime(that.data.list[i - 1].op_time, "M-D")) {
                    array.push(that.data.list[i]);
                  }
                  else {
                    array = [];
                    array.push(that.data.list[i]);
                  }
                  that.data.showList[utils.formatTime(that.data.list[i].op_time, "M-D")] = array;
                }
                else {
                  array.push(that.data.list[i]);
                  that.data.showList[utils.formatTime(that.data.list[i].op_time, "M-D")] = array;
                  console.log(i = 0);
                }
              }
              that.setData({
                finallList: that.data.showList,
                showModal:false
              });
              console.log(that.data.finallList);
            }
          })
        }
      }
    })
  }
});

function postList(that, res) {
  that.setData({
    list: res.data.result
  });
  console.log(that.data.list);
  let array = [];
  for (var i = 0; i < that.data.list.length; i++) {
    that.data.list[i]['time'] = utils.formatTime(that.data.list[i].op_time, "h:m");
    if (i != 0) {
      if (utils.formatTime(that.data.list[i].op_time, "M-D") == utils.formatTime(that.data.list[i - 1].op_time, "M-D")) {
        array.push(that.data.list[i]);
      }
      else {
        array = [];
        array.push(that.data.list[i]);
      }
      that.data.showList[utils.formatTime(that.data.list[i].op_time, "M-D")] = array;
    }
    else {
      array.push(that.data.list[i]);
      that.data.showList[utils.formatTime(that.data.list[i].op_time, "M-D")] = array;
      console.log(i = 0);
    }
  }
  that.setData({
    finallList: that.data.showList
  });
  console.log(that.data.finallList);
}

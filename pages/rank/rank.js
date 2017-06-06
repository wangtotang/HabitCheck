// pages/index/index.js

var Event = require('../../utils/event.js');
var Bmob = require('../../utils/bmob.js');
var Toast = require('../../components/toast/toast');

var total = 0,
  rankList = [];

Page(Object.assign({}, Toast,{

  /**
   * 页面的初始数据
   */
  data: {
    rank: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;

    Event.getInstance().addListener('rank', this, () => {
      console.log(rankList[0].nickName);
      if (rankList.length == total) {
        rankList.sort((x, y) => {
          let xValue = x.totalCount;
          let yValue = y.totalCount;
          if (xValue > yValue) return -1;
          else if (xValue < yValue) return 1;
          else return 0;
        });
        wx.stopPullDownRefresh();
        that.setData({
          rank: rankList,
        });
      }
    });

    this.getRank();

  },

  onUnload: function () {
    Event.getInstance().removeListener('rank', this);
  },

  onPullDownRefresh: function () {
    this.getRank();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '打卡排行榜',
      path: 'pages/rank/rank',
      success(res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        });
      }
    }
  },

  /**
   * 获取排名
   */
  getRank() {//todo:2017-6-6 打卡天数相同，习惯多的排前面，一样多时，昵称排前
    let that = this;
    rankList = [];
    let User = Bmob.Object.extend('_User');
    let query = new Bmob.Query(User);
    query.find({
      success(res) {
        //console.log(res.length);
        if (res.length > 0) {
          total = res.length;
          for (let user of res) {
            if (user.get('nickName')) {
              //console.log(user.get('nickName'));
              let Habit = Bmob.Object.extend('habit');
              let query = new Bmob.Query(Habit);
              query.equalTo('own', user);
              query.descending('totalCount');
              query.find({
                success(results) {
                  //console.log(results.length);
                  if (results.length > 0) {
                    let userModel = new UserModel(user.get('nickName'), user.get('userPic'), results[0].get('totalCount'));
                    rankList.push(userModel);
                    Event.getInstance().emit('rank', '');
                  }
                },
                error(results, err) {
                  wx.stopPullDownRefresh();
                  that.showZanToast('网络异常');
                }
              });
            }else{
              total--;
            }
          }
        }
      },
      error(results, err) {
        wx.stopPullDownRefresh();
        that.showZanToast('网络异常');
      }
    });
  },
}))

class UserModel {
  constructor(nickName, userPic, totalCount) {
    this.nickName = nickName;
    this.userPic = userPic;
    this.totalCount = totalCount;
  };
}
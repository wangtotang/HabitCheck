// pages/index/index.js

var Bmob = require('../../utils/bmob.js');
var Toast = require('../../components/toast/toast');

var total = 10,
  rankList = [];

Page(Object.assign({}, Toast, {

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
    this.getRank();
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
   * 获取排名 //todo:2017-6-12 服务器获取排名
   */
  getRank() {//todo:2017-6-6 打卡天数相同，习惯多的排前面，一样多时，昵称排前
    let that = this;
    rankList = [];

    let Habit = Bmob.Object.extend('habit');
    let query = new Bmob.Query(Habit);
    query.include('own');
    query.descending('totalCount');
    query.find({
      success(results) {
        if (results.length > 0) {
          for (let habit of results) {
            if (rankList.length <= total) {
              let userModel = new UserModel(habit.get('own'), habit.get('totalCount'));
              let mIndex = rankList.findIndex((value, index, obj) => {
                if (value.user.get('username') == userModel.user.get('username')) {
                  return true;
                }
                return false;
              }, userModel);
              if (mIndex == -1) {
                if (userModel.user.get('nickName') != undefined && userModel.user.get('nickName') != ''
                  && userModel.user.get('userPic') != undefined && userModel.user.get('userPic') != '') {
                  rankList.push(userModel);
                }
              }
            } else {
              break;
            }
          }
        }
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
      },
      error(results, err) {
        wx.stopPullDownRefresh();
        that.showZanToast('网络异常');
      }
    });
  },
}))

class UserModel {
  constructor(user, totalCount) {
    this.user = user;
    this.totalCount = totalCount;
  };
}
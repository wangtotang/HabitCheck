
var Event = require('../../../utils/event.js');
var Bmob = require('../../../utils/bmob.js');

//获取应用实例
var app = getApp();
const STORAGE_KEY = 'habits';

Page({
  data: {
    habits: [],
    category: app.globalData.category,
  },

  onLoad: function () {
    let that = this;
    //初始化列表数据
    // let tmp = wx.getStorageSync(STORAGE_KEY);
    // if (tmp == null || tmp == '') {
    //   tmp = [];
    // }
    // this.setData({
    //   habits: tmp,
    // });
    this.getList();

    Event.getInstance().addListener('add', this, () => {
      this.getList();
    });

    //签到后，刷新数据
    Event.getInstance().addListener('signed', this, (data) => {
      // let tmp = wx.getStorageSync(STORAGE_KEY);
      // let habitData = tmp.find((obj) => obj.id == data);
      // habitData.totalCount = habitData.totalCount || 0;
      // habitData.totalCount++;
      // wx.setStorageSync(STORAGE_KEY, tmp);

      // this.setData({
      //   habits: tmp,
      // });

      let Habit = Bmob.Object.extend('habit');
      let query = new Bmob.Query(Habit);
      query.get(data, {
        success(result) {
          let count = result.get('totalCount');
          result.set('totalCount', ++count);
          result.save(null, {
            success() {
              that.getList();
            }
          });
        }
      });
    });
  },

  onUnload: function () {
    Event.getInstance().removeListener('add', this);
    Event.getInstance().removeListener('signed', this);
  },

  /**
   * 刷新列表
   */
  getList() {
    let that = this;
    let Habit = Bmob.Object.extend('habit');
    let query = new Bmob.Query(Habit);
    query.descending('updatedAt');
    let currentUser = Bmob.User.current();
    let User = Bmob.Object.extend("_User");
    let UserModel = new User();
    if (currentUser) {
      UserModel.id = currentUser.id;
      query.equalTo('own', UserModel);
    }
    query.find({
      success(results) {
        that.setData({
          habits: results,
        })
      },
    });
  },

  /**
   * 新增习惯
   */
  addHabit() {
    wx.navigateTo({
      url: '../add/add'
    });
  },

  /**
   * 查看习惯签到日历
   */
  watch() {
    wx.navigateTo({
      url: '../check/check'
    });
  },

  /**
   * 长按删除
   */
  deleteHabit(event) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: 'green',
      confirmText: '确定',
      confirmColor: 'green',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
            mask: true,
          });

          let Habit = Bmob.Object.extend('habit');
          //删除月打卡表
          let MonthSign = Bmob.Object.extend('month_sign');
          let queryMonthSign = new Bmob.Query(MonthSign);
          let HabitModel = new Habit();
          HabitModel.id = event.currentTarget.dataset.id;
          queryMonthSign.equalTo('own', HabitModel);
          queryMonthSign.destroyAll();

          //删除习惯表 
          let query = new Bmob.Query(Habit);
          query.equalTo('objectId', event.currentTarget.dataset.id);
          query.destroyAll({
            success() {
              wx.hideLoading();
              that.getList();
            },
            error() {
              wx.hideLoading();
              wx.showToast({
                title: '删除习惯失败',
                icon: 'loading',
                duration: 2000,
              });
            }
          });
          // let tmp = wx.getStorageSync(STORAGE_KEY);
          // let index = tmp.findIndex((obj) => obj.id == event.currentTarget.dataset.id);
          // if (index != -1) {
          //   tmp.splice(index, 1);
          //   wx.setStorageSync(STORAGE_KEY, tmp);
          //   that.setData({
          //     habits: tmp,
          //   });
          // }
        }
      },
    })
  },

})

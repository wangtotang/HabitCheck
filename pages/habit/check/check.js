
var Event = require('../../../utils/event.js');
var Bmob = require('../../../utils/bmob.js');

//获取应用实例
var app = getApp();

const STORAGE_KEY = 'habits';
var date,
  id,
  monthSign,
  monthKey = '';

Page({
  /**
  * 页面的初始数据
  */
  data: {

  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {

    let that = this;
    //动态设置标题
    wx.setNavigationBarTitle({
      title: options.title,
    });

    wx.showLoading({
      title: '正在加载',
      mask: true,
    });

    //获取"表"数据
    // habits = wx.getStorageSync(STORAGE_KEY);

    //无法取得数据返回
    // if (habits == null || habits == '') {
    //   wx.navigateBack();
    //   return;
    // }
    // habitData = habits.find((obj) => obj.id == id);
    // if (habitData == undefined) {
    //   wx.navigateBack();
    //   return;
    // }

    //初始化日历
    let mydate = new Date();
    let year = mydate.getFullYear();
    let month = mydate.getMonth() + 1;
    date = mydate.getDate();
    let day = mydate.getDay();
    //求星期
    let nbsp = 7 - ((date - day) % 7);
    let monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    }

    id = options.id;

    //获取当月打卡数据
    let MonthSign = Bmob.Object.extend('month_sign');
    let query = new Bmob.Query(MonthSign);
    let Habit = Bmob.Object.extend("habit");
    let HabitModel = new Habit();
    HabitModel.id = id;
    query.equalTo('own', HabitModel);
    monthKey = year + '-' + month;
    query.equalTo('month', monthKey);
    query.find({
      success(results) {
        wx.hideLoading();
        if (results.length > 0) {
          monthSign = results[0];
        } else {
          monthSign = new MonthSign();
          monthSign.set('own', HabitModel);
          monthSign.set('month', monthKey);
          monthSign.set('count', 0);
          monthSign.set('signData', '{}');
          monthSign.save();
        }

        that.setData({
          year: year,
          month: month,
          monthSignCount: monthSign.get('count'),
          nbsp: nbsp,
          date: date,
          monthSignData: JSON.parse(monthSign.get('signData')),
          monthDaySize: monthDaySize,
        });
      },
      error(results, err) {
        if (err == undefined) {
          monthSign = new MonthSign();
          monthSign.set('own', HabitModel);
          monthSign.set('month', monthKey);
          monthSign.set('count', 0);
          monthSign.set('signData', '{}');
          monthSign.save();
          
          that.setData({
            year: year,
            month: month,
            monthSignCount: monthSign.get('count'),
            nbsp: nbsp,
            date: date,
            monthSignData: JSON.parse(monthSign.get('signData')),
            monthDaySize: monthDaySize,
          });
        } else {
          wx.hideLoading();
          wx.navigateBack();
        }
      }
    });

    //初始化月签到数
    // monthKey = month + '';
    // if (habitData.monthSignCount == undefined) {
    //   habitData.monthSignCount = {};
    //   habitData.monthSignCount[monthKey] = 0;
    // } else if (habitData.monthSignCount[monthKey] == undefined) {
    //   habitData.monthSignCount[monthKey] = 0;
    // }
    //初始化月签到数据
    // if (habitData.monthSignData == undefined) {
    //   habitData.monthSignData = {};
    //   habitData.monthSignData[monthKey] = {};
    // } else if (habitData.monthSignData[monthKey] == undefined) {
    //   habitData.monthSignData[monthKey] = {};
    // }

    // this.setData({
    //   year: year,
    //   month: month,
    //   monthSignCount: habitData.monthSignCount[monthKey],
    //   nbsp: nbsp,
    //   date: date,
    //   monthSignData: habitData.monthSignData[monthKey],
    //   monthDaySize: monthDaySize,
    // });
  },

  /**
   * 签到处理
   */
  monthSign: function () {
    let that = this;
    let monthSignData = JSON.parse(monthSign.get('signData'));
    monthSignData[date + ''] = date;
    let count = monthSign.get('count');
    monthSign.set('count', ++count);
    monthSign.set('signData', JSON.stringify(monthSignData));
    monthSign.save(null, {
      success(result) {
        Event.getInstance().emit('signed', id);

        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 2000
        });

        that.setData({
          monthSignCount: monthSign.get('count'),
          monthSignData: JSON.parse(monthSign.get('signData')),
        });
      },
      error(result, err) {
        wx.showToast({
          title: '打卡失败，请重新打卡',
          icon: 'loading',
          duration: 2000,
        });
      }
    });

    // habitData.monthSignData[monthKey][date + ''] = date;
    // habitData.monthSignCount[monthKey]++;
    // wx.setStorageSync(STORAGE_KEY, habits);

    // Event.getInstance().emit('signed', id);

    // wx.showToast({
    //   title: '打卡成功',
    //   icon: 'success',
    //   duration: 2000
    // });

    // this.setData({
    //   monthSignCount: habitData.monthSignCount[monthKey],
    //   monthSignData: habitData.monthSignData[monthKey],
    // });
  },
})

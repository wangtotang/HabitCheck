// calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',
    iday: 0,
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    directions: ['北方', '东北方', '东方', '东南方', '南方', '西南方', '西方', '西北方'],
    tools: ['Eclipse写程序', 'MSOffice写文档', '记事本写程序', 'Windows8', 'Linux', 'MacOS', 'IE', 'Android设备', 'iOS设备'],
    varNames: ['jieguo', 'huodong', 'pay', 'expire', 'zhangdan', 'every', 'free', 'i1', 'a', 'virtual', 'ad', 'spider', 'mima', 'pass', 'ui'],
    drinks: ['水', '茶', '红茶', '绿茶', '咖啡', '奶茶', '可乐', '鲜奶', '豆奶', '果汁', '果味汽水', '苏打水', '运动饮料', '酸奶', '酒'],
    activities: [
      { name: '写单元测试', good: '写单元测试将减少出错', bad: '写单元测试会降低你的开发效率' },
      { name: '洗澡', good: '你几天没洗澡了？', bad: '会把设计方面的灵感洗掉', weekend: true },
      { name: '锻炼一下身体', good: '', bad: '能量没消耗多少，吃得却更多', weekend: true },
      { name: '抽烟', good: '抽烟有利于提神，增加思维敏捷', bad: '除非你活够了，死得早点没关系', weekend: true },
      { name: '白天上线', good: '今天白天上线是安全的', bad: '可能导致灾难性后果' },
      { name: '重构', good: '代码质量得到提高', bad: '你很有可能会陷入泥潭' },
      { name: '使用%t', good: '你看起来更有品位', bad: '别人会觉得你在装逼' },
      { name: '跳槽', good: '该放手时就放手', bad: '鉴于当前的经济形势，你的下一份工作未必比现在强' },
      { name: '招人', good: '你面前这位有成为牛人的潜质', bad: '这人会写程序吗？' },
      { name: '面试', good: '面试官今天心情很好', bad: '面试官不爽，会拿你出气' },
      { name: '提交辞职申请', good: '公司找到了一个比你更能干更便宜的家伙，巴不得你赶快滚蛋', bad: '鉴于当前的经济形势，你的下一份工作未必比现在强' },
      { name: '申请加薪', good: '老板今天心情很好', bad: '公司正在考虑裁员' },
      { name: '晚上加班', good: '晚上是程序员精神最好的时候', bad: '', weekend: true },
      { name: '在妹子面前吹牛', good: '改善你矮穷挫的形象', bad: '会被识破', weekend: true },
      { name: '撸管', good: '避免缓冲区溢出', bad: '强撸灰飞烟灭', weekend: true },
      { name: '浏览成人网站', good: '重拾对生活的信心', bad: '你会心神不宁', weekend: true },
      { name: '命名变量\'%v\'', good: '', bad: '' },
      { name: '写超过%l行的方法', good: '你的代码组织的很好，长一点没关系', bad: '你的代码将混乱不堪，你自己都看不懂' },
      { name: '提交代码', good: '遇到冲突的几率是最低的', bad: '你遇到的一大堆冲突会让你觉得自己是不是时间穿越了' },
      { name: '代码复审', good: '发现重要问题的几率大大增加', bad: '你什么问题都发现不了，白白浪费时间' },
      { name: '开会', good: '写代码之余放松一下打个盹，有益健康', bad: '小心被扣屎盆子背黑锅' },
      { name: '打DOTA', good: '你将有如神助', bad: '你会被虐的很惨', weekend: true },
      { name: '晚上上线', good: '晚上是程序员精神最好的时候', bad: '你白天已经筋疲力尽了' },
      { name: '修复BUG', good: '你今天对BUG的嗅觉大大提高', bad: '新产生的BUG将比修复的更多' },
      { name: '设计评审', good: '设计评审会议将变成头脑风暴', bad: '人人筋疲力尽，评审就这么过了' },
      { name: '需求评审', good: '', bad: '' },
      { name: '上微博', good: '今天发生的事不能错过', bad: '今天的微博充满负能量', weekend: true },
      { name: '上AB站', good: '还需要理由吗？', bad: '满屏兄贵亮瞎你的眼', weekend: true },
      { name: '玩FlappyBird', good: '今天破纪录的几率很高', bad: '除非你想玩到把手机砸了', weekend: true }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = new Date();
    this.data.iday = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    this.setData({
      currentDate: today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日 星期'
      + this.data.weeks[today.getDay()],
      direction: this.data.directions[this.getRandomNumber(this.data.iday, 2) % this.data.directions.length],
      drink: this.getRandomCount(this.data.drinks, 2).join('、'),
      star: this.getRandomStar(),
    });
    this.getTodayLucky(today.getDay());
  },

  /*
   * 注意：本程序中的“随机”都是伪随机概念，以当前的天为种子。
   */
  getRandomNumber: function (daySeed, indexSeed) {
    let n = daySeed % 11117;
    for (let i = 0; i < 100 + indexSeed; i++) {
      n = n * n;
      n = n % 11117;   // 11117 是个质数
    }
    return n;
  },

  /**
   *  从数组中随机挑选 size 个
   */
  getRandomCount: function (array, size) {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      result.push(array[i]);
    }
    for (let j = 0; j < array.length - size; j++) {
      let index = this.getRandomNumber(this.data.iday, j) % result.length;
      result.splice(index, 1);
    }
    return result;
  },

  /**
   * 获取星星数
   */
  getRandomStar: function () {
    let num = this.getRandomNumber(this.data.iday, 6) % 5 + 1;
    let result = '';
    let i = 0;
    while (i < num) {
      result += '★';
      i++;
    }
    while (i < 5) {
      result += '☆';
      i++;
    }
    return result;
  },

  /**
   * 获取今日运势
   */
  getTodayLucky: function (today) {
    let _activities = [];
    let numGood = this.getRandomNumber(this.data.iday, 98) % 3 + 2;
    let numBad = this.getRandomNumber(this.data.iday, 87) % 3 + 2;

    if (today == 0 || today == 6) {
      for (let i = 0; i < this.data.activities.length; i++) {
        let tmp = this.data.activities[i];
        if (tmp.weekend) _activities.push(tmp);
      }
    } else {
      _activities.push(...this.data.activities);
    }

    let events = this.getRandomCount(_activities, numGood + numBad);
    for (let i = 0; i < events.length; i++) {
      events[i] = this.getParseString(events[i]);
    }

    this.setData({
      goods:events.splice(0,numGood),
      bads:events,
    })

  },

  /**
   * 解析占位符并替换成随机内容
   */
  getParseString: function (event) {
    let {name, good, bad} = event;
    if (name.indexOf('%v') != -1) {
      name = name.replace('%v', this.data.varNames[this.getRandomNumber(this.data.iday, 12) % this.data.varNames.length]);
    }
    if (name.indexOf('%t') != -1) {
      name = name.replace('%t', this.data.tools[this.getRandomNumber(this.data.iday, 11) % this.data.tools.length]);
    }
    if (name.indexOf('%l') != -1) {
      name = name.replace('%l', (this.getRandomNumber(this.data.iday, 12) % 247 + 30).toString());
    }
    return { name, good, bad };
  }
})
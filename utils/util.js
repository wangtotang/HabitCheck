function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatGender(g) {
  if (g == '0') {
    return "未知"
  } else if (g == 1) {
    return "男"
  } else if (g == '2') {
    return "女"
  } else {
    return g
  }
}

function formatCountry(c) {
  if (c == "CN") {
    return "中国"
  } else {
    return c
  }
}
module.exports = {
  formatTime: formatTime,
  formatGender: formatGender,
  formatCountry: formatCountry
}

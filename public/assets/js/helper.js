// Some helper methods:
//=====================

exports.hideNav = function () {
  nav = document.getElementsByTagName('nav')[0];
  nav.style.height = 0;
};

exports.setNavColor = function setNavColor(str) {
  var colors = {
   blue :  "#73C5E1",
   orange :  "#FBA827",
   green :  "#1FDA9A",
   pink :  "#EB65A0",
   yellow :  "#FFD452",
   grey :  "#F2F2F3",
   black :  "#333333",
   red :  "#e65656"
 };
 nav = document.getElementsByTagName('nav')[0];
 nav.style.height = '3px';
 nav.style.backgroundColor = colors[str] || str;
};

exports.setTitle = function(str) {
  document.title = ' Beta | ' + str;
  var tooldiv = document.getElementById('title');
  tooldiv.innerHTML = '<span>' + str + '</span>';
};

// Some helper methods:
//=====================

function hideNav() {
  nav = document.getElementsByTagName('nav')[0];
  nav.style.height = 0;
};

function setNavColor(str) {
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
  console.log('Changing color to ' + colors[str]);
  nav = document.getElementsByTagName('nav')[0];
  nav.style.height = '3px';
  nav.style.backgroundColor = colors[str];
};

function setTitle(str) {
  document.title = 'Alfa | ' + str;
  var tooldiv = document.getElementById('title');
  tooldiv.innerHTML = '<span>' + str + '</span>';
  console.log('Changing name to ' + str);
};

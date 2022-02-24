// Helper functions.
var getContext = function(width, height) {
  var canvas = document.createElement("canvas");
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  return canvas.getContext('2d');
};

var getImageData = function(img, loaded) {

  var imgObj = new Image();
  var imgSrc = img.src || img;

  // Can't set cross origin to be anonymous for data url's
  // https://github.com/mrdoob/three.js/issues/1305
  if (imgSrc.substring(0, 5) !== 'data:')
    imgObj.crossOrigin = "Anonymous";

  imgObj.onload = function() {
    var context = getContext(imgObj.width, imgObj.height);
    context.drawImage(imgObj, 0, 0);

    var imageData = context.getImageData(0, 0, imgObj.width, imgObj.height);
    loaded && loaded(imageData.data);
  };

  imgObj.src = imgSrc;

};

var makeRGB = function(name) {
  return ['rgb(', name, ')'].join('');
};

var mapPalette = function(palette) {
  var arr = [];
  for (var prop in palette) {
    arr.push(frmtPobj(prop, palette[prop]))
  };
  arr.sort(function(a, b) {
    return (b.count - a.count)
  });
  return arr;
};

var fitPalette = function(arr, fitSize) {
  if (arr.length > fitSize) {
    return arr.slice(0, fitSize);
  } else {
    for (var i = arr.length - 1; i < fitSize - 1; i++) {
      arr.push(frmtPobj('0,0,0', 0))
    };
    return arr;
  };
};

var frmtPobj = function(a, b) {
  return {
    name: makeRGB(a),
    count: b
  };
}


// RGBaster Object
// ---------------
//
var PALETTESIZE = 10;

var RGBaster = {};

RGBaster.colors = function(img, opts) {

  opts = opts || {};
  var exclude = opts.exclude || [], // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
      paletteSize = opts.paletteSize || PALETTESIZE;

  getImageData(img, function(data) {

    var colorCounts = {},
        rgbString = '',
        rgb = [],
        colors = {
          dominant: {
            name: '',
            count: 0
          },
          palette: []
        };

    var i = 0;
    for (; i < data.length; i += 4) {
      rgb[0] = data[i];
      rgb[1] = data[i + 1];
      rgb[2] = data[i + 2];
      rgbString = rgb.join(",");

      // skip undefined data and transparent pixels
      if (rgb.indexOf(undefined) !== -1 || data[i + 3] === 0) {
        continue;
      }

      // Ignore those colors in the exclude list.
      if (exclude.indexOf(makeRGB(rgbString)) === -1) {
        if (rgbString in colorCounts) {
          colorCounts[rgbString] = colorCounts[rgbString] + 1;
        } else {
          colorCounts[rgbString] = 1;
        }
      }

    }

    if (opts.success) {
      var palette = fitPalette(mapPalette(colorCounts), paletteSize + 1);
      opts.success({
        dominant: palette[0].name,
        secondary: palette[1].name,
        palette: palette.map(function(c) {
          return c.name;
        }).slice(1)
      });
    }
  });
};

let header = document.getElementsByTagName('header')[0]
if (header.getAttribute('class') == 'post-bg') {

  let img_url = header.getAttribute('style').split('\'')[1]
  header.setAttribute('style','background:#f2f6fc')
  let div_info = header.lastChild
  let img = document.createElement('img')
  img.setAttribute('id', 'post-cover-img')
  img.setAttribute('src', img_url)
  img.setAttribute('class', 'cover entered loading')

  let div_img = document.createElement('div')
  div_img.setAttribute('id', 'post-cover')
  div_img.appendChild(img)
  header.insertBefore(div_img,div_info)

  let list = []
  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      for (let k = 0; k <= 5; k++) {
        list.push(`rgb(${i},${j},${k})`)
        list.push(`rgb(${255 - i},${255 - j},${255 - k})`)
      }
    }
  }
  RGBaster.colors(img_url, {
    paletteSize: 30,
    exclude: list,
    success: function (payload) {
      const c = payload.dominant.match(/\d+/g);
      console.log(c)
      const grayLevel = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
      document.styleSheets[0].addRule(':root', '--main: ' + payload.dominant)
      document.styleSheets[0].addRule(':root', '--second: ' + (grayLevel >= 192 ? '#000' : '#FFF'))
      document.styleSheets[0].addRule(':root', `--main-light: rgba(${c[0]}, ${c[1]}, ${c[2]}, .4)`)
      document.styleSheets[0].addRule(':root', `--main-shadow: 0 8px 12px -3px rgba(${c[0]}, ${c[1]}, ${c[2]}, .2)`)
      document.styleSheets[0].addRule(':root', '--cover-text: ' + (grayLevel >= 192 ? '#4C4948' : '#EEE'))
      document.styleSheets[0].addRule(':root', `--cover-bg: rgba(${c[0]}, ${c[1]}, ${c[2]})`)
    }
  })
} else {
  document.styleSheets[0].addRule(':root', '--main: #49B1F5')
  document.styleSheets[0].addRule(':root', '--second: #FFF')
  document.styleSheets[0].addRule(':root', `--main-light: rgba(73, 177, 245, .4)`)
  document.styleSheets[0].addRule(':root', '--main-shadow: 0 8px 12px -3px rgba(73, 177, 245, .2)')
  document.styleSheets[0].addRule(':root', '--cover-text: #EEE')
  document.styleSheets[0].addRule(':root', '--cover-bg: #49B1F5')
}


let mobile_sidebar_menus = document.getElementById("sidebar-menus");
mobile_sidebar_menus.style.borderRadius = '10px 0 0 10px'
mobile_sidebar_menus.style.width = '280px'
let menu_center_div = document.getElementsByClassName("site-data is-center")[0]
while (menu_center_div.hasChildNodes()) {
  menu_center_div.removeChild(menu_center_div.firstChild);
}
let msg =
    "<span style='font-weight:bold;font-size:20px;display:block;margin-top:-25px'>" +
    "Loong"+
    "</span>"+
    "<span style='font-weight:bold'>" +
    "因为热爱，所以坚持"+
    "</span>";
menu_center_div.insertAdjacentHTML("beforeend", msg);

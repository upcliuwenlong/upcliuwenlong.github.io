if (document.getElementById('post-cover-img')) {
    let list = []
    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 5; j++) {
            for (let k = 0; k <= 5; k++) {
                list.push(`rgb(${i},${j},${k})`)
                list.push(`rgb(${255 - i},${255 - j},${255 - k})`)
            }
        }
    }
    RGBaster.colors(document.getElementById('post-cover-img').getAttribute('src'), {
        paletteSize: 30,
        exclude: list,
        success: function (payload) {
            const c = payload.dominant.match(/\d+/g);
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








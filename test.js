var fs = require('fs')
var path = require('path')
var Canvas = require('canvas')

var canvas = Canvas.createCanvas(2000, 1000)
var ctx = canvas.getContext('2d')

const text = 'Omnis vero possimus qui fugiat';
const textMeasure = ctx.measureText(text)

ctx.globalAlpha = 0.2

ctx.globalAlpha = 1
ctx.font = 'normal 40px Impact, serif'

ctx.translate(20, -40)

ctx.fillStyle = '#000'
ctx.fillText('Omnis vero possimus qui fugiat', 49, 99)

console.log(textMeasure);


canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'text.png')))

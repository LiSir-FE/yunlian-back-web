let gulp = require('gulp')
let sshSftp = require('gulp-ssh')
let config = require('./config')
let imagemin = require('gulp-imagemin')
let pngquant = require('imagemin-pngquant')
let copy = require('gulp-copy')
let clean = require('gulp-clean')
let del = require('del')
let vinylPaths = require('vinyl-paths')
let fs = require('fs')

let runProFlag = true
let assetPath = ''
let ftpAuth = {}
let ftpAuthImg = {}
let sshSftpConfig = {}

if (process.env.NODE_ENV === 'development') {
  runProFlag = true
  assetPath = './dist/' + process.env.ProVersionTime + '/'
  // 测试服务器-前端项目打版
  runProFlag = false
  assetPath = config.test.assetsRoot
  sshSftpConfig = {
    host: '106.14.243.47',
    port: 21,
    username: 'liliang',
    password: '7cpswyNf8kK$Et64 '
    // privateKey: fs.readFileSync(privateKeyPath + 'mykey.pem')
  }
}


if (!runProFlag) {
  let gulpSSH = new sshSftp({
    ignoreErrors: false,
    sshConfig: sshSftpConfig
  })
  // 压缩img内未经压缩的图片,存至imagemins文件夹内
  gulp.task('imagemin', function () {
    return gulp.src(assetPath + '/static/img/**/*.{png,jpg,gif,svg}')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
      }))
      .pipe(gulp.dest(assetPath + '/static/imagemins'))
  })

  // 删除img内未经压缩处理的图片
  gulp.task('clean-img', ['imagemin'], function () {
    return gulp.src(assetPath + '/static/img/**/*', {read: false})
      .pipe(clean())
  })

  // 复制压缩后的图片到img文件夹
  gulp.task('copy-img', ['clean-img'], function () {
    return gulp.src(assetPath + '/static/imagemins/**/*')
      .pipe(gulp.dest(assetPath + '/static/img/'))
  })

  // 删除复制完压缩图后的imagemins文件夹
  gulp.task('clean-imagemins', ['copy-img'], function () {
    return gulp.src(assetPath + '/static/imagemins', {read: false})
      .pipe(clean({force: true}))
  })

  gulp.task('deploy', ['clean-imagemins'], function () {
    return gulp.src(assetPath + '/**/*')
      .pipe(gulpSSH.dest('/data/here'))
  })
}

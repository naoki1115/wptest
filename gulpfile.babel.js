// Gulp module imports
// ----
global.env = process.env.NODE_ENV || 'DEV'
import {
  src,
  dest,
  watch,
  parallel,
  series,
  lastRun
} from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
const $ = gulpLoadPlugins({
  pattern: [
    'gulp-*',
    'postcss-preset-env',
    'css-mqpacker',
    'imagemin-pngquant',
    'del',
    'browser-sync',
    'connect-ssi'
  ],
  rename: {
    'gulp-sass-glob': 'sassGlob',
    'gulp-clean-css': 'cleanCSS',
    'gulp-pug-inheritance': 'pugInheritance',
    'postcss-preset-env': 'presetEnv',
    'css-mqpacker': 'mqpacker',
    'imagemin-pngquant': 'pngquant',
    'browser-sync': 'browserSync',
    'connect-ssi': 'connectSSI'
  }
})
const browserSync = $.browserSync.create()

// Directories
// ----
const paths = {
  src: './source', // Source Folder
  dest: './theme/myoriginal', // Dest Folder
  ast: './theme/myoriginal/assets'
}
const assets = '/assets'
const buildFolder = '' // 入力する場合は先頭にスラッシュ・最後は付けない
const buildPath = `${paths.dest}${buildFolder}`
const jsAssets = `${assets}/js`
const jsPlugins = `${jsAssets}/plugins`
const jsPaths = {
  src: `${paths.src}/es6/**/*.es6`,
  minSrc: `${paths.src}/src/js/**/*.js`,
  srcGlob: `${paths.src}/src/js`,
  destGlob: `${paths.dest}${jsAssets}`,
  plugins: `${paths.dest}${jsPlugins}`
}
const sassFolder = '/sass'
const cssAssets = `${assets}/css`
const cssPlugins = `${cssAssets}/plugins`
const cssPaths = {
  src: `${paths.src}${sassFolder}/**/*.{sass,scss}`,
  minSrc: `${paths.src}/src/css/**/*.css`,
  srcGlob: `${paths.src}/src/css`,
  destGlob: `${paths.dest}${cssAssets}`,
  plugins: `${paths.dest}${cssPlugins}`
}
const htmlPaths = {
  base: `${paths.src}/pug`,
  src: `${paths.src}/pug/**/*.pug`
}
const iconsFolder = '/fonts/icons'
const iconsAssets = `${assets}${iconsFolder}`
const iconsPaths = {
  src: `${paths.src}/icons/*.svg`,
  srcGlob: `${paths.src}/src/icons`,
  dest: `${paths.dest}${iconsAssets}`,
  templates: `${paths.src}/templates`
}
const imagesAssets = `${assets}/img`
const imagesPaths = {
  src: `${paths.src}/img/**/*.{gif,jpg,png,svg}`,
  dest: `${paths.dest}${imagesAssets}`
}
const cleanFolder = [`${paths.ast}/**/*`, `${paths.src}/src/**/*`]

/**
 * copy settings
 */
const staticSrc = `${paths.src}/static/**/*`
const devSrc = `${paths.src}/dev/**/*`

const jsPluginsList = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/jquery/dist/jquery.min.js',
  // './node_modules/swiper/dist/js/swiper.js',
  // './node_modules/swiper/dist/js/swiper.min.js',
]
const cssPluginsList = [
  // './node_modules/swiper/dist/css/swiper.css',
  // './node_modules/swiper/dist/css/swiper.min.css'
]

/**
 * icons settings
 */
const iconFontName = 'itp-drone-icon'

/**
 * htdocs init clean
 */
export const clean = () => $.del(cleanFolder)

/**
 * localhost server
 */
const devServer = cb => {
  if (env === 'DEV') {
    browserSync.init({
      server: {
        baseDir: paths.dest,
        index: 'index.html',
        middleware: [
          $.connectSSI({
            baseDir: paths.dest,
            ext: '.html'
          })
        ]
      },
      port: 8014,
      open: false,
      notify: false
    })
  }
  cb()
}


/**
 * watch
 */
export const devWatch = cb => {
  watch(cssPaths.src, series(styles, cssMinify))
  watch(imagesPaths.src, series(imageMinify))
  cb()
}

const onError = function (err) {
  $.notify.onError({
    title: 'error',
    message: '<%= error.message %>'
  })(err)
  this.emit('end')
}

/**
 * babel
 */
export const scripts = () =>
  src(jsPaths.src)
  .pipe(
    $.plumber({
      errorHandler: onError
    })
  )
  .pipe($.if(env === 'DEV', $.sourcemaps.init()))
  .pipe($.babel())
  .pipe(dest(jsPaths.srcGlob))
  .pipe($.if(env === 'DEV', $.sourcemaps.write()))
  .pipe($.sourcemaps.write())
  .pipe(
    $.if(
      env !== 'DEV',
      dest(`${buildPath}${jsAssets}`),
      dest(jsPaths.destGlob)
    )
  )
  .pipe(browserSync.stream())

/**
 * sass
 */
export const styles = () => {
  const sassOptions = {
    indentType: 'space',
    indentWidth: 2,
    outputStyle: 'expanded',
    errLogToConsole: false
  }
  const postcssPlugins = [
    $.presetEnv({
      browers: ['last 2 version', 'ie >= 11', 'iOS >= 9.0', 'Android >= 5.0'],
      features: {
        rem: {
          rootValue: '10px'
        }
      }
    }),
    $.mqpacker()
  ]
  return src(cssPaths.src)
    .pipe(
      $.plumber({
        errorHandler: onError
      })
    )
    .pipe($.if(env === 'DEV', $.sourcemaps.init()))
    .pipe($.sassGlob())
    .pipe($.sass(sassOptions))
    .pipe($.postcss(postcssPlugins))
    .pipe(dest(cssPaths.srcGlob))
    .pipe($.if(env === 'DEV', $.sourcemaps.write()))
    .pipe($.cssnano())
    .pipe(
      $.if(
        env !== 'DEV',
        dest(`${buildPath}${cssAssets}`),
        dest(cssPaths.destGlob)
      )
    )
    .pipe(browserSync.stream())
}

/**
 * pug
 */
// const pugOptions = {
//   pretty: '  ', // indent style
//   basedir: htmlPaths.base
// }
// export const html = () =>
//   src(htmlPaths.src)
//     .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
//     .pipe(
//       $.changed(paths.dest, {
//         extension: '.html'
//       })
//     )
//     .pipe($.cached('pug'))
//     .pipe(
//       $.debug({
//         title: 'pug-debug-before'
//       })
//     )
//     .pipe(
//       $.pugInheritance({
//         basedir: htmlPaths.base,
//         skip: 'node_modules'
//       })
//     )
//     .pipe(
//       $.debug({
//         title: 'pug-debug-after'
//       })
//     )
//     .pipe(
//       $.filter(function(file) {
//         return !/\/_/.test(file.path) && !/^_/.test(file.relative)
//       })
//     )
//     .pipe($.pug(pugOptions))
//     .pipe($.if(env === 'DEV', $.replace('.min', '')))
//     .pipe($.if(env === 'DEV', $.replace(`${buildFolder}`, '')))
//     .pipe($.replace('target="blank"', 'target="blank" rel="noopener"')) // セキュリティ対策
//     // .pipe($.if(env !== 'DEV', $.replace('<!-- ga-->', ga)))
//     // .pipe($.if(env !== 'DEV', $.replace('<!-- gtm-->', gtm)))
//     // .pipe($.if(env !== 'DEV', $.replace('<!-- ytm-->', ytm)))
//     .pipe($.if(env !== 'DEV', $.replace('__NOCACHE__', Date.now())))
//     .pipe($.if(env !== 'DEV', dest(`${buildPath}`), dest(paths.dest)))
//     .pipe(browserSync.stream())

// export const htmlPhp = () =>
//   src(`${paths.src}/pug/contact/**/*.pug`)
//     .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
//     .pipe(
//       $.changed(paths.dest, {
//         extension: '.php'
//       })
//     )
//     .pipe($.cached('pug'))
//     .pipe(
//       $.debug({
//         title: 'pug-debug-before'
//       })
//     )
//     .pipe(
//       $.pugInheritance({
//         basedir: htmlPaths.base,
//         skip: 'node_modules'
//       })
//     )
//     .pipe(
//       $.debug({
//         title: 'pug-debug-after'
//       })
//     )
//     .pipe(
//       $.filter(function(file) {
//         return !/\/_/.test(file.path) && !/^_/.test(file.relative)
//       })
//     )
//     .pipe($.pug(pugOptions))
//     .pipe($.if(env === 'DEV', $.replace('.min', '')))
//     .pipe($.if(env === 'DEV', $.replace(`${buildFolder}`, '')))
//     .pipe($.replace('target="blank"', 'target="blank" rel="noopener"')) // セキュリティ対策
//     // .pipe($.if(env !== 'DEV', $.replace('<!-- ga-->', ga)))
//     // .pipe($.if(env !== 'DEV', $.replace('<!-- gtm-->', gtm)))
//     // .pipe($.if(env !== 'DEV', $.replace('<!-- ytm-->', ytm)))
//     .pipe($.if(env !== 'DEV', $.replace('__NOCACHE__', Date.now())))
//     .pipe(
//       $.rename({
//         extname: '.php'
//       })
//     )
//     .pipe($.if(env !== 'DEV', dest(`${buildPath}`), dest(paths.dest)))
//     .pipe(browserSync.stream())

const uglifyOptions = {
  compress: {
    drop_console: true
  },
  output: {
    comments: 'some'
  }
}

const renameTransform = {
  suffix: '.min'
}

/**
 * Javascript Minify
 */
export const jsMinify = () =>
  src(jsPaths.minSrc)
  .pipe($.uglify(uglifyOptions))
  .pipe($.rename(renameTransform))
  .pipe(
    $.if(
      env !== 'DEV',
      dest(`${buildPath}${jsAssets}`),
      dest(jsPaths.destGlob)
    )
  )

/**
 * CSS Minify
 */
export const cssMinify = () =>
  src(cssPaths.minSrc)
  .pipe($.cleanCSS())
  .pipe($.rename(renameTransform))
  .pipe(
    $.if(
      env !== 'DEV',
      dest(`${buildPath}${cssAssets}`),
      dest(cssPaths.destGlob)
    )
  )

/**
 * Images Minify
 */
export const imageMinify = () => {
  const pngquantOptions = {
    quality: [0.7, 0.85],
    speed: 1
  }
  const jpegtranOptions = {
    quality: 80,
    progressive: true,
    interlaced: true
  }
  const minConfig = [
    $.pngquant(pngquantOptions),
    $.imagemin.jpegtran(jpegtranOptions),
    $.imagemin.svgo(),
    $.imagemin.optipng(),
    $.imagemin.gifsicle()
  ]
  return src(imagesPaths.src)
    .pipe($.changed(paths.dest))
    .pipe($.imagemin(minConfig))
    .pipe(
      $.if(
        env !== 'DEV',
        dest(`${buildPath}${imagesAssets}`),
        dest(imagesPaths.dest)
      )
    )
}

/**
 * copy
 */
export const staticCopy = () =>
  src(staticSrc).pipe(
    $.if(
      env !== 'DEV',
      dest(`${buildPath}${assets}`),
      dest(`${paths.dest}${assets}`)
    )
  )

/**
 * dev cpy
 */
export const devCopy = () =>
  src(devSrc).pipe($.if(env === 'DEV', dest(paths.dest)))

// modules scripts
export const pluginsCopy = () =>
  src(jsPluginsList).pipe(
    $.if(env !== 'DEV', dest(`${buildPath}${jsPlugins}`), dest(jsPaths.plugins))
  )

// modules styles
export const stylesCopy = () =>
  src(cssPluginsList).pipe(
    $.if(
      env !== 'DEV',
      dest(`${buildPath}${cssPlugins}`),
      dest(cssPaths.plugins)
    )
  )

/**
 * icon fonts
 */
export const iconfont = () => {
  const fontOptions = {
    fontName: iconFontName,
    startUnicode: 0xf001,
    formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
  }
  const iconStream = src(iconsPaths.src)
    // .pipe($.imagemin($.imagemin.svgo()))
    .pipe($.iconfont(fontOptions))

  return iconStream
    .on('glyphs', function (glyphs, options) {
      const engine = 'lodash',
        className = 'icon'

      glyphs = glyphs.map(function (glyph) {
        return {
          name: glyph.name,
          codepoint: glyph.unicode[0].charCodeAt(0).toString(16) // convert decimal to hex
        }
      })

      let cssHtmlOptionsFontPath = `../../.${paths.dest}${iconsAssets}/`

      if (env === 'PRO') {
        cssHtmlOptionsFontPath = `../../.${buildPath}${iconsAssets}/`
      }

      const cssHtmlOptions = {
        glyphs: glyphs,
        fontName: options.fontName,
        fontPath: cssHtmlOptionsFontPath,
        className: className,
        cacheBusterQueryString: options.timestamp
      }

      const scssOptions = {
        glyphs: glyphs,
        fontName: options.fontName,
        fontPath: `..${iconsFolder}/`,
        className: className,
        cacheBusterQueryString: options.timestamp
      }

      // scss
      src(`${iconsPaths.templates}/icons.styles`)
        .pipe($.consolidate(engine, scssOptions))
        .pipe(
          $.rename({
            basename: '_icons',
            extname: '.scss'
          })
        )
        .pipe(dest(`${paths.src}${sassFolder}`))

      // css - アイコン確認用
      src(`${iconsPaths.templates}/icons.styles`)
        .pipe($.consolidate(engine, cssHtmlOptions))
        .pipe(
          $.rename({
            basename: options.fontName,
            extname: '.css'
          })
        )
        .pipe(dest(iconsPaths.srcGlob))

      // html - アイコン確認用
      src(`${iconsPaths.templates}/icons.html`)
        .pipe($.consolidate(engine, cssHtmlOptions))
        .pipe(
          $.rename({
            basename: 'index'
          })
        )
        .pipe(dest(iconsPaths.srcGlob))
    })
    .pipe(
      $.if(
        env !== 'DEV',
        dest(`${buildPath}${iconsAssets}`),
        dest(iconsPaths.dest)
      )
    )
}

// copy run
// ----
export const copy = parallel(staticCopy, pluginsCopy, /** stylesCopy */ )
// export const copy = parallel(staticCopy, devCopy)
export const init = series(clean, parallel(copy, iconfont))
export const compile = parallel(scripts, styles, /** html */ )
export const minify = parallel(jsMinify, cssMinify, imageMinify)
exports.default = series(init, compile, devWatch)
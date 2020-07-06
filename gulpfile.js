const { src, watch, dest, parallel, series } = require('gulp');
const gulpconnect = require('gulp-connect');
const inject = require('gulp-inject');
const replace = require('gulp-replace');
var handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const fs = require('fs-extra');
const path = require('path');

const hubspot_head = `
  <title>{{ content.html_title }}</title>\n
  <meta name="description" content="{{ content.meta_description }}">\n
  {{ standard_header_includes }}\n
`;

const hubspot_footer = '{{ standard_footer_includes }}';

// get and parse json data in './src/data' to be passed as templateData to hbs
const getData = (name) => {
  const filePath = path.join(__dirname + `/src/data/${name}.json`);
  const exists = fs.pathExistsSync(filePath);
  return exists ? fs.readJsonSync(filePath) : {};
};

// prepare hbs template data
const hbsData = (names = []) => (fn) =>
  names.reduce((acc, name) => ((acc[name] = fn(name)), acc), {});

// html
const html = () => {
  return src('./dev/*.html').pipe(gulpconnect.reload(() => {}));
};

// handlebars templating engine configurations
// pass in 'data/[file name]' into hsbData func in order to make
// data accessible globably with [file name .e.g section-5] as key
// to data belonging to that .json file
const hbs = () => {
  const files = [
    'hero',
    'accordion',
    'section-1',
    'section-2',
    'section-3',
    'section-4',
    'section-5',
    'section-6',
    'section-7',
    'section-8',
    'section-9',
    'section-10',
  ];
  const templateData = hbsData(files)(getData);
  const options = {
    ignorePartials: true,
    batch: [
      './src/partials/sections',
      './src/partials',
      './src/components',
      './src/components/base',
    ],
    helpers: {
      isEven(num) {
        return num % 2 === 0;
      },
      not(val) {
        return !val;
      },
      isFirst(index) {
        return index === 0;
      },
      isLast(current, total) {
        return current === total;
      },
    },
  };

  return src('./src/*.hbs')
    .pipe(handlebars(templateData, options))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dev/'))
    .pipe(gulpconnect.reload());
};

// css for development
const css = () => {
  return src('./src/*.css')
    .pipe(postcss({ mode: 'development' }))
    .pipe(dest('./dev/'))
    .pipe(gulpconnect.reload());
};

// optimize css for production by purging unused css and minifying file
const optimizeCss = () => {
  return src('./src/*.css')
    .pipe(postcss({ mode: 'production' }))
    .pipe(cleanCss())
    .pipe(dest('./dev/'));
};

// add js file to dev dir for development
const js = () => {
  return src('./src/*.js').pipe(dest('./dev/')).pipe(gulpconnect.reload());
};

// optimize js for production
const optimizeJs = () => {
  return src('./dec/*.js').pipe(uglify()).pipe(dest('./dev/'));
};

// live server with hot reloading
const connect = (done) => {
  gulpconnect.server(
    {
      root: './dev/',
      livereload: true,
      port: 3000,
    },
    function () {
      this.server.on('close', done);
    }
  );
};

// watch files
const watchFiles = (done) => {
  watch('./src/**/*.html', html);
  watch('./src/*.hbs', series(hbs, developmentBuild));
  watch('./src/partials/**/*.hbs', series(hbs, developmentBuild));
  watch('./src/components/**/*.hbs', series(hbs, developmentBuild));
  watch('./src/data/**/*.json', series(hbs, developmentBuild));
  watch('./src/**/*.css', css);
  watch('./src/**/*.js', js);
  done();
};

// Development/Default task outputs html,css,js under dev dir
// and inject *.css, *.js files into ./dev/*.html during development
const developmentBuild = () => {
  const target = src('./dev/*.html');
  const sources = src(['./dev/index.css', './dev/index.js'], { read: true });
  return target
    .pipe(inject(sources, { relative: true }))
    .pipe(dest('./dev'))
    .pipe(gulpconnect.reload());
};

// Production task. inlines source into html file
// and replaces fields required by hubspot
const productionBuild = () => {
  return src('./dev/index.html')
    .pipe(
      inject(src(['./dev/index.css']), {
        starttag: '<!-- inject:hubspot_head -->',
        transform: () => hubspot_head,
        removeTags: true,
      })
    )
    .pipe(
      inject(src(['./dev/index.css']), {
        starttag: '<!-- inject:{{ext}} -->',
        transform: (_, file) =>
          `<style>\n ${file.contents.toString('utf8')}\n </style>`,
        removeTags: true,
      })
    )
    .pipe(
      inject(src(['./dev/index.js']), {
        starttag: '<!-- inject:{{ext}} -->',
        transform: (_, file) =>
          `<script>\n ${file.contents.toString('utf8')}\n </script>`,
        removeTags: true,
      })
    )
    .pipe(
      inject(src(['./dev/index.css']), {
        starttag: '<!-- inject:hubspot_footer -->',
        transform: () => hubspot_footer,
        removeTags: true,
      })
    )
    .pipe(
      replace(
        /<!-- replace:form -->(.|\n)*?<!-- end-replace -->/g,
        '{% module "module_1578348745710267" path="/Landing Pages/Modules/Form", label="Form" %}'
      )
    )
    .pipe(dest('./dist/'));
};

// development build process
exports.default = series(
  hbs,
  css,
  js,
  developmentBuild,
  parallel(connect, watchFiles)
);

// production build process
exports.prod = series(optimizeCss, optimizeJs, productionBuild);

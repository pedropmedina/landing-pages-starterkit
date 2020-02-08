const { src, watch, dest, parallel, series } = require('gulp');
const gulpconnect = require('gulp-connect');
const inject = require('gulp-inject');
const replace = require('gulp-replace');
var handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');

const hubspot_head = `
  <title>{{ content.html_title }}</title>\n
  <meta name="description" content="{{ content.meta_description }}">\n
  {{ standard_header_includes }}\n
`;
const hubspot_footer = '{{ standard_footer_includes }}';

// html
function html() {
  return src('./dev/*.html').pipe(gulpconnect.reload(() => {}));
}

// css for development
function css() {
  return src('./src/*.css')
    .pipe(postcss({ mode: 'development' }))
    .pipe(dest('./dev/'))
    .pipe(gulpconnect.reload());
}

// css for production
function purgeCss() {
  return src('./src/*.css')
    .pipe(postcss({ mode: 'production' }))
    .pipe(dest('./dev/'));
}

// handlebars templating engine configurations
function hbs() {
  return src('./src/*.hbs')
    .pipe(
      handlebars(
        {},
        { ignorePartials: true, batch: ['./src/partials', './src/components'] }
      )
    )
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dev/'))
    .pipe(gulpconnect.reload());
}

// live server with hot reloading
function connect(done) {
  gulpconnect.server(
    {
      root: './dev/',
      livereload: true
    },
    function() {
      this.server.on('close', done);
    }
  );
}

// watch files
function watchFiles(done) {
  watch('./src/**/*.html', html);
  watch('./src/*.hbs', hbs);
  watch('./src/partials/**/*.hbs', hbs);
  watch('./src/components/**/*.hbs', hbs);
  watch('./src/*.css', css);
  watch('./src/**/*.js', html);
  done();
}

// Production task. inlines source into html file
// and replaces fields required by hubspot
function productionBuild() {
  return src('./dev/index.html')
    .pipe(
      inject(src(['./dev/index.css']), {
        starttag: '<!-- inject:hubspot_head -->',
        transform: () => hubspot_head,
        removeTags: true
      })
    )
    .pipe(
      inject(src(['./dev/index.css']), {
        starttag: '<!-- inject:head:{{ext}} -->',
        transform: (_, file) =>
          `<style>\n ${file.contents.toString('utf8')}\n </style>`,
        removeTags: true
      })
    )
    .pipe(
      inject(src(['./dev/index.css']), {
        starttag: '<!-- inject:hubspot_footer -->',
        transform: () => hubspot_footer,
        removeTags: true
      })
    )
    .pipe(
      replace(
        /<!-- replace:form -->(.|\n)*?<!-- end-replace -->/g,
        '{% module "module_1578348745710267" path="/Landing Pages/Modules/Form", label="Form" %}'
      )
    )
    .pipe(dest('./dist/'));
}

exports.default = series(hbs, css, parallel(connect, watchFiles));
exports.prod = series(purgeCss, productionBuild);

fis.hook('amd', {
    baseUrl: "./js",
    paths: {
        'Handlebars': 'lib/handlebars.runtime-v3.0.3',
        'IScroll': "lib/iscroll",
        'iScroll': "lib/iscroll1",
        'jValidate': "lib/validate/jquery.validate",
        'jquery': "lib/jquery-2.1.4",
        'swiper': "lib/swiper/swiper-3.3.1.jquery.min"
    },
    shim: {
        "IScroll": {
            exports: "IScroll"
        },
        "iScroll": {
            exports: "iScroll"
        }
    }
});

fis.match('*', {
    release: '/static/$0',
    //useMap: true
});
fis.match('*.html', {
    release: '/$0'
});
fis.match('*.{css,less,scss}', {
  preprocessor: fis.plugin('autoprefixer', {
    "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
    "cascade": true
  })
})
fis.match('**/*.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('node-sass', {
        //fis-parser-node-sass option
    })
});
fis.match('*.{js,css}', {
    useHash: true
});

//npm install -g fis-parser-handlebars-3.x
fis.match('*.handlebars', {
    rExt: '.js', // from .handlebars to .js 虽然源文件不需要编译，但是还是要转换为 .js 后缀
    parser: fis.plugin('handlebars-3.x', {
        //fis-parser-handlebars-3.x option
    }),
    release: false // handlebars 源文件不需要编译
});
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        sourceMap: true,
        useInlineMap: true
    })
});
// fis.match('/js/module/**', {
//     isMod: true
// });
fis.media("prod")
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: {
                includeAsyncs: true
            }
        })
    })
    .match('/js/require.js', {
        packTo: '/pkg/common.js',
        packOrder: -100
    })
    .match('/js/lib/jquery-2.1.4.js', {
        packTo: '/pkg/common.js',
        packOrder: -90
    })
    .match('/js/module/**', {
        requires: ['/js/require.js']
    })
    .match('{/js/lib/*.js,/js/app/util/*.js,/js/app/controller/base.js,/js/app/module/loading/loading.js}', {
        requires: ['/js/require.js'],
        packTo: '/pkg/common.js'
    })
    .match("**.js", {
        optimizer: fis.plugin('uglify-js')
    })
    .match("**.css", {
        optimizer: fis.plugin('clean-css')
    })
    .match("/css/*.css", {
        packTo: '/pkg/common.css'
    })
    .match('**.png', {
        optimizer: fis.plugin('png-compressor')
    });
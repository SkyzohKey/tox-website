# gulp-assets-version-replace 中文说明  [![Build Status](https://travis-ci.org/bammoo/gulp-assets-version-replace.svg?branch=master)](https://travis-ci.org/bammoo/gulp-assets-version-replace) [![npm version](https://badge.fury.io/js/gulp-assets-version-replace.svg)](http://badge.fury.io/js/gulp-assets-version-replace)

[Grunt 版本](https://www.npmjs.com/package/grunt-assets-version-replace)


> 静态文件版本管理 Gulp 插件，最方便的静态文件发布方案。

## Features

- js css 等静态文件生成以文件内容的 md5 命名的新文件
- 只对有改动的静态文件生成新版本
- 自动替换所有模板引用，理论上支持所有模板语言 php, python Django, Expressjs ejs jade 等


## 如果没有用过 gulp 请看 [http://gulpjs.com/](http://gulpjs.com/)


### Examples

#### 1. 文件结构

**静态资源如下：**


```
js_build/app.js
css_build/webapp.css
```

* `js_build` 和 `css_build` 下的文件是 compass uglify 生成的文件*


**你模板中的链接如下：**

```html
<link href="static/dist/css_build/webapp.__placeholder__.css" />
```

*注意:  `__placeholder__` 是还未生成过版本的标识。*


#### 2. gulpfile.js 配置如：

```js
gulp.task('assetsVersionReplace', function () {
  gulp.src(['css_build/*.css', 'js_build/*.js'])
    .pipe(assetsVersionReplace({
      replaceTemplateList: [
        'php-templates/header.php',
        'php-templates/footer.php'
      ]
    }))
    .pipe(gulp.dest('dist/'))
});
```

#### 3. 运行 gulp task
  
`gulp assetsVersionReplace` 
  
得到结果：

```
dist/js_build/app.c7ccb6b8ce569a65ed09d4256e89ec30.js
dist/css_build/webapp.2af81cda4dacbd5d5294539474076aae.css
```

* **模板中静态文件版本号也被自动替换了**

```html
<link href="static/dist/css_build/webapp.2af81cda4dacbd5d5294539474076aae.css" />
```

#### 4. 提交

如果是静态网站，可以直接提交模板替换版本号的变更了。

### More Example

某些情况下，模板是由其他 gulp 动态生成的。比如下面的例子，dist 下的 php 总是包含 `__placeholder__` 因为它们是从 dev 下拷贝过来的。这时设置 [`versionsAmount: 0` option](#optionsreplacetemplatelist) 可以实现每次替换 `__placeholder__`。

```js
gulp.task('copyTemplates', function () {
  return gulp.src('php-templates-dev/*.php')
        .pipe(usemin({
            jsmin: uglify()
        }))
        .pipe(gulp.dest('php-templates-dist'));
})
gulp.task('assetsVersionReplace', ['copyTemplates'], function () {
  return gulp.src(['css_build/*.css', 'js_build/*.js'])
    .pipe(assetsVersionReplace({
      versionsAmount: 0,
      replaceTemplateList: [
        'php-templates-dist/header.php',
        'php-templates-dist/footer.php'
      ]
    }))
    .pipe(gulp.dest('dist/'))
});
```


### Gulp4 Example

这里有一个 gulp4 配置本插件的示例: [gulp-workflow](https://github.com/bammoo/gulp-workflow/blob/master/h5-app/tasks-for-gulp4/gulpfile.js)


## 安装


```shell
npm install gulp-assets-version-replace --save-dev
```

在 gulpfile.js 中加上

```js
var assetsVersionReplace = require('gulp-assets-version-replace');
```

**运行 gulp task 后 Gulpfile.js 目录下会生成一个 `gulp-assets-version-replace-version.json`** 的文件用于本地存储 json 格式的版本管理数据库。

在你的模板中使用这样的格式：

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>test</title>
  <link href="static/dist/css_build/app.__placeholder__.css" />
  <link href="static/dist/css_build/desktop.__placeholder__.css" />
</head>
<body>
```

**注意:** 
`__placeholder__` 是还未生成过版本的标识。


## 配置

### 配置选项

#### options.versionsAmount

本地 json 文件保留多少个版本，设置为 `0` 将取消保存版本号。

#### options.replaceTemplateList

要替换时间戳的 html 或 php 或其他任意格式的文件模板。**模板路径必须是基于 gulpfile.js 的相对路径**

Type: `Array`
Default value: `[]`


## Release History

* 2015-12-19   v2.1.0   More stable now
* 2015-12-16   v2.0.0   More standard for gulp pipe
* 2015-12-15   v1.0.0


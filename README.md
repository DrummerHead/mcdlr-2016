# MCDLR 2016 Redesign

## Install

Make sure you have Ruby 2.3.1 installed. You can install and switch to different versions or Ruby using something like [chruby](https://github.com/postmodern/chruby) and [ruby-install](https://github.com/postmodern/ruby-install). This project has a `.ruby-version` dotfile that ensures the switch automatically.

```
gem install middleman
npm install -g gulp-cli
npm install
```


## Run dev server

```
middleman serve
```

And visit `http://localhost:9000/`


## Linting

**JS**

```
gulp js-lint
```

And for the gulpfile:

```
gulp gulpfile-lint
```

**SCSS**

```
gulp sass-lint
```

or the alias

```
gulp scss-lint
```

**HTML**

```
gulp html-lint
```


## Build project

```
middleman build
gulp post-build
```

Static build now at `/build`

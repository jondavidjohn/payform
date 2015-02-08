SHELL := /bin/bash
BIN := ./node_modules/.bin/

build:
	$(BIN)coffee -c --no-header -o ./dist/ ./src/payform.coffee
	$(BIN)uglify -s ./dist/payform.js -o ./dist/payform.min.js
	$(BIN)browserify -p bundle-collapser/plugin -t coffeeify --extension='.coffee' ./src/jquery.payform.coffee > ./dist/jquery.payform.js
	$(BIN)uglify -s ./dist/jquery.payform.js -o ./dist/jquery.payform.min.js

watch: build
	$(BIN)watch 'make build' ./src

test:
	$(BIN)mocha ./test/**_spec.coffee

.PHONY: build test watch

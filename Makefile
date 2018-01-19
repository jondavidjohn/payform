SHELL := /bin/bash
BIN := node_modules/.bin/

build: dist/payform.js dist/payform.min.js dist/jquery.payform.js dist/jquery.payform.min.js

dist/payform.js: src/payform.coffee
	$(BIN)coffee -c --no-header -o dist/ src/payform.coffee

dist/payform.min.js: dist/payform.js
	$(BIN)uglifyjs dist/payform.js -o dist/payform.min.js

dist/jquery.payform.js: src/jquery.payform.coffee
	$(BIN)browserify             \
	  -p bundle-collapser/plugin \
	  -t coffeeify               \
	  --extension='.coffee'      \
	  src/jquery.payform.coffee > dist/jquery.payform.js

dist/jquery.payform.min.js: dist/jquery.payform.js
	$(BIN)uglifyjs dist/jquery.payform.js -o dist/jquery.payform.min.js

watch: build
	$(BIN)watch 'make build' src

test:
	$(BIN)mocha test/**_spec.coffee

clean:
	rm -rf dist/*.js

.PHONY: build test watch

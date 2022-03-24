PACKAGE_NAME=package-rebuilder-website

# Tools

SASS ?= sass
YARN ?= yarn

# Variables

PORT ?= 9966
HOST ?= localhost
VERSION ?= $(shell cat $(CURDIR)/version 2> /dev/null || echo 0.0.0-unreleased)
LOGO = reproducible_builds.svg

all: vendor

install-deps:
	sudo dnf install -y caddy tmux yarnpkg rubygem-sass nodejs

# Watchers

.PHONY: sass-watcher
sass-watcher: vendor
	$(SASS) --watch src/style.scss:public/bundle.css

.PHONY: js-watcher
js-watcher: vendor
	# TODO: yarn run doesn't work..
	./node_modules/.bin/budo src/index.js:bundle.js --dir public --host $(HOST) --port $(PORT) --live -- -t babelify

# Dist

.PHONY: dist
dist: vendor
	@mkdir -p "dist/${PACKAGE_NAME}-${VERSION}"
	cp -avf public/index.html public/qubesos.html public/debian_*.html dist/${PACKAGE_NAME}-${VERSION}/
	cp -rvf public/icons -t dist/${PACKAGE_NAME}-${VERSION}/
	cp -rvf public/images -t dist/${PACKAGE_NAME}-${VERSION}/
	cp -vf public/favicon.png -t dist/${PACKAGE_NAME}-${VERSION}/
	$(SASS) -t compressed src/style.scss "dist/${PACKAGE_NAME}-${VERSION}/bundle-${VERSION}.css"
	$(YARN) run -s browserify -t babelify src/index.js | $(YARN) run -s terser --compress --mangle > "dist/${PACKAGE_NAME}-${VERSION}/bundle-${VERSION}.js"

	# sed the version file in html
	@sed -i 's/bundle.js/bundle-${VERSION}.js/' "dist/${PACKAGE_NAME}-${VERSION}/index.html"
	@sed -i 's/bundle.css/bundle-${VERSION}.css/' "dist/${PACKAGE_NAME}-${VERSION}/index.html"

	cd dist && tar --owner=0 --group=0 -czvf ${PACKAGE_NAME}-${VERSION}.tar.gz "${PACKAGE_NAME}-${VERSION}"

# Yarn

.PHONY: vendor
vendor: .yarninstall

.yarninstall: package.json
	@$(YARN) install --silent
	@touch $@

.PHONY:
distsize:
	@du -s "dist/${PACKAGE_NAME}-${VERSION}"

.PHONY:
clean:
	$(YARN) cache clean
	@rm -rf dist
	@rm -rf node_modules
	@rm -f .yarninstall

# Constants #
#############

port_dev=5001

out=dist
public_path=/7guis-React-TypeScript-MobX/

webpack=./node_modules/webpack/bin/webpack.js
webpack-dev-server=./node_modules/webpack-dev-server/bin/webpack-dev-server.js


# Installation #
################

# Smart install: Only executes if package.json's
# modification date is later than node_module's
install: node_modules

node_modules: package.json
	npm install
	@touch -m node_modules


# Dev Mode #
############

dev: node_modules
	ENV=loc \
	PORT=$(or $(port),$(port_dev)) \
	$(webpack-dev-server) -d --progress --colors --open


# Building #
############

build: node_modules src webpack.config.js
	rm -rf ./$(out)
	BUILD=true \
	OUTPUT=$(out) \
	PUBLIC_PATH=$(public_path) \
	$(webpack) --progress --profile


# Deployment #
##############

publish: build
	rm -rf gh-pages
	git clone -b gh-pages --single-branch --depth 1 git@github.com:eugenkiss/7guis-React-TypeScript-MobX.git gh-pages
	rm -rf gh-pages/*
	cp -r dist/* gh-pages/
	cd gh-pages && git add . && git commit --amend -m "Update site" && git push -f
	rm -rf gh-pages

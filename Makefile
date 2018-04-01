NPM_BIN=./node_modules/.bin

out=dist
port_dev=5001
public_path=/7guis-React-TypeScript-MobX/


install: node_modules

node_modules: package.json
	npm install
	@touch -m node_modules

dev: node_modules
	ENV=loc \
	PORT=$(or $(port),$(port_dev)) \
	$(NPM_BIN)/webpack-dev-server -d --progress --colors --open

build: node_modules src webpack.config.js
	rm -rf ./$(out)
	BUILD=true \
	OUTPUT=$(out) \
	PUBLIC_PATH=$(public_path) \
	$(NPM_BIN)/webpack --progress --profile

# Just needed as a sanity check
# Note: Adjust public_path to '/', build, and then serve.
serve:
	$(NPM_BIN)/serve dist

publish: build
	rm -rf gh-pages
	git clone -b gh-pages --single-branch --depth 1 git@github.com:eugenkiss/7guis-React-TypeScript-MobX.git gh-pages
	rm -rf gh-pages/*
	cp -r dist/* gh-pages/
	cd gh-pages && git add . && git commit --amend -m "Update site" && git push -f
	rm -rf gh-pages

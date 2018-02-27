# Constants #
#############

port_dev=5001

out=dist

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
	$(webpack) --progress --profile


# Deployment #
##############

# TODO gh-pages

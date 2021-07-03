PHONY: clean
SHELL := /bin/bash

clean:
	rm -rf dist
	rm -rf extension
	rm -rf build

e2e_venv:
	python3 -m venv ./test/e2e/venv
	source ./test/e2e/venv/bin/activate && pip install -r ./test/e2e/requirements.txt

e2e_test_env: build
	source test/e2e/venv/bin/activate; \
	python -m unittest ./test/e2e/test_env.py

build: clean
	npm run compile
	mkdir -p build
	cp -r src/* build/
	find ./build -name "*.ts" -type f -delete
	rsync -a dist/ build
	rollup build/background/install.js --file build/background/install.bundle.js --format iife --validate
	rollup build/background/background.js --file build/background/background.bundle.js --format iife --validate
	mkdir extension
	cd build/; 	zip -r ../extension/extension.zip .

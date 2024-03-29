.PHONY: clean test
SHELL := /bin/bash

clean:
	rm -rf dist
	rm -rf extension
	rm -rf build
	rm -rf publish

e2e_venv:
	python3 -m venv ./test/e2e/venv
	source ./test/e2e/venv/bin/activate && pip install -r ./test/e2e/requirements.txt

build: clean
	npm run compile
	mkdir -p build
	cp -r src/* build/
	find ./build -name "*.ts" -type f -delete
	find ./build -name "*.js" -type f -delete

	npx rollup dist/src/background/install.js --file build/background/install.bundle.js --validate
	npx rollup dist/src/background/background.js --file build/background/background.bundle.js --validate
	npx rollup dist/src/content/main.js --file build/content/main.bundle.js --validate

	npx rollup dist/src/view/popup/popup.js --file build/view/popup/popup.bundle.js --validate
	npx rollup dist/src/view/settings/settings.js --file build/view/settings/settings.bundle.js --validate
	npx rollup dist/src/view/tasks/tasks.js --file build/view/tasks/tasks.bundle.js --validate
	npx rollup dist/src/view/worksheet/worksheet.js --file build/view/worksheet/worksheet.bundle.js --validate

	mkdir extension
	cd build/; 	zip -r ../extension/extension_to_e2e.zip .
	sed -i "/key/d" build/manifest.json
	cd build/; 	zip -r ../extension/extension.zip .

publish: build
	mkdir -p publish
	cp -r build/* publish/

	npx javascript-obfuscator publish/background/install.bundle.js --output publish/background/install.bundle.js
	npx javascript-obfuscator publish/background/background.bundle.js --output publish/background/background.bundle.js
	npx javascript-obfuscator publish/content/main.bundle.js --output publish/content/main.bundle.js

	npx javascript-obfuscator publish/view/popup/popup.bundle.js --output publish/view/popup/popup.bundle.js
	npx javascript-obfuscator publish/view/settings/settings.bundle.js --output publish/view/settings/settings.bundle.js
	npx javascript-obfuscator publish/view/tasks/tasks.bundle.js --output publish/view/tasks/tasks.bundle.js
	npx javascript-obfuscator publish/view/worksheet/worksheet.bundle.js --output publish/view/worksheet/worksheet.bundle.js

	cd publish/; 	zip -r ../extension/extension_to_publish.zip .

test:
	npm run test

e2e_test:
	source test/e2e/venv/bin/activate; \
	python -m unittest discover -s test/e2e;

smoke_test:
	source test/e2e/venv/bin/activate; \
	python -m unittest discover -p "unit_*.py" -s test/e2e;

define remove
    sed 's/{NAME}/$(1)/' greetings.tmpl >$(2).txt
endef

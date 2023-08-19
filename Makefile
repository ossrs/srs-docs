.PHONY: default clean build

default: build

build:
	npm run build

clean:
	rm -rf build

test:
	npm run build

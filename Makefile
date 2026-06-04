.PHONY: run test clean install install-dev docker-build docker-run

run:
	flask run --host=0.0.0.0 --port=8080

test:
	pytest -v

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete

install:
	pip install -r requirements/base.txt

install-dev:
	pip install -r requirements/dev.txt

docker-build:
	docker build -t ting-lab .

docker-run:
	docker run -p 8080:8080 ting-lab

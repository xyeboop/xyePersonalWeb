FROM python:3.11-slim AS builder

WORKDIR /app

COPY requirements/base.txt requirements/
RUN pip install --no-cache-dir -r requirements/base.txt


FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .

EXPOSE 8080

CMD ["gunicorn", "wsgi:app", "--bind", "0.0.0.0:8080", "--workers", "4", "--access-logfile", "-", "--error-logfile", "-"]

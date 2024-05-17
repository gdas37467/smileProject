FROM python:3.11-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 
RUN apt-get update && apt-get install -y cron


WORKDIR /app


COPY requirements.txt .
RUN pip install -r requirements.txt


COPY . .
EXPOSE 8000

RUN python manage.py migrate
RUN python manage.py crontab add



CMD cron -f && timedatectl set-timezone Asia/Kolkata && gunicorn --config gunicorn_config.py smile.wsgi:application


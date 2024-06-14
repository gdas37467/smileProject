FROM python:3.12-bullseye

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

WORKDIR /app

RUN apt-get update && apt-get install -y cron


COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

RUN python manage.py makemigrations
RUN python manage.py makemigrations adminUser
RUN python manage.py makemigrations donor
RUN python manage.py makemigrations recipient

RUN python manage.py migrate

RUN python manage.py crontab add
RUN python manage.py crontab add
 

#CMD cron -f & python manage.py runserver 0.0.0.0:8000
CMD cron -f & gunicorn --config gunicorn_config.py smile.wsgi:application


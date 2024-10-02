"""
Django settings for smile project.

Generated by 'django-admin startproject' using Django 4.1.10.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path
import environ
from dotenv import load_dotenv
import os

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))







# env = environ.Env()


# environ.Env.read_env()


SECRET_KEY = os.environ.get('SECRET_KEY')

#SESSION_SAVE_EVERY_REQUEST = True


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS').split(',')


# Application definition

INSTALLED_APPS = [
    'recipient.apps.RecipientConfig',
    'donor.apps.DonorConfig',
    'adminUser.apps.AdminuserConfig',
    'corsheaders',#custom addded
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_crontab',
   
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware', # custom added
    'corsheaders.middleware.CorsMiddleware', #custom added
    
]


CSRF_TRUSTED_ORIGINS = os.environ.get('CORS_ALLOWED_AND_CSRF_TRUSTED_ORIGINS').split(',')

#CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 45*60
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
# SESSION_ENGINE = 'django.contrib.sessions.models.Session'

CSRF_COOKIE_AGE = 86400 

# custom added
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_AND_CSRF_TRUSTED_ORIGINS').split(',')




CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]


CORS_ALLOW_HEADERS = [
    'Accept',
    'Accept-Language',
    'token',  # custom added
    'content-type',  # custom added
    'x-csrftoken',
    'Authorization',
]







ROOT_URLCONF = 'smile.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
MEDIA_URL = '/app/media/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_URL =  '/app/static/'
# MEDIA_ROOT = 'media'
print(MEDIA_ROOT)

WSGI_APPLICATION = 'smile.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

# print(type(env('HOST')))
# print(type(env('PASSWORD')))
# print(env('AUTHSOURCE'))
# print(type('mongodb+srv://gdas:abcdefgh@smile1.lbmzkff.mongodb.net/?retryWrites=true&w=majority'))
# host =str(env('HOST'))
# user = str(env('USERNAME'))
# password = str(env('PASSWORD'))
#print(os.environ.get('HOST'))

DATABASES = {
        'default': {
            'ENGINE': os.environ.get('DB_ENGINE'),
            'NAME': os.environ.get('DB_NAME'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT')
        }
        
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_TZ = True

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend', # default authentication
    #'userAuthentication.backends.EmailBackend',  # Custom authentication backend for email
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/



# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'





EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_HOST_USER=os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD=os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND')


#cron job
CRONJOBS = [
   ( '31 18 * * *', 'smile.cronjob.updateUnits', '>> ' + os.path.join(BASE_DIR,'log/debug7.log' + ' 2>&1 ')),
   #    ('* * * * *', 'smile.cronjob.updateUnits', '>> ' + os.path.join(BASE_DIR,'log/debug7.log' + ' 2>&1 ')),
    # Add more cron jobs as needed
]




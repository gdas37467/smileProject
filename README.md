# SMILE NGO Website

Welcome to the SMILE NGO website repository! This project is designed to streamline blood donation management and support our life-saving mission. 

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [Contact Developer](#contact)

## Project Overview

The SMILE NGO website is a comprehensive platform designed to facilitate blood donation management. It allows users to request blood for patients in need, register as donors, and enables administrators to manage these requests efficiently.

## Features

- **Blood Donation Management**: Users can request blood and register as donors.
- **Admin Panel**: Admins can accept/reject blood requests, contact donors, add new donors, and create requests on behalf of patients.
- **Database Management**: Maintains a database with over 2000+ active donors and serves 10-15 patients daily.

## Technologies Used

- **Frontend**: ReactJS, MaterialUI, ChakraUI
- **Styling**: SASS
- **Backend**: Django
- **Database**: PostgreSQL
- **Web Server**: NGINX
- **Containerization**: Docker
- **Version Control**: GitHub

## Installation

Follow these steps to get a local copy up and running.

1. **Clone the Repository:**

   Navigate to your local GitHub branch and pull the latest changes:

    ```bash
    git clone https://github.com/gdas37467/smileProject.git
    cd smileProject
    git pull origin localSetup
    ```

    Replace `<your_local_ip>` in the frontend configuration to your local network IP (example: 192.168.0.2), `localhost`, or `127.0.0.1` wherever applicable:

         Pages and Components
        // Example file: Blood-bank-frontend/smile/src/Pages/AdminLogin.jsx
        'http://<your_local_ip>:8000/api/v1/adminUser/admin_login/';

2. **Frontend Setup:**

   - Navigate to the `Blood-bank-frontend/smile` directory:

        ```bash
        cd Blood-bank-frontend/smile
        ```

   - Install the dependencies:

        ```bash
        npm install
        ```

   - Start the Frontend:

        ```bash
        npm run dev
        ```

### Backend Setup

1. Navigate to the `Blood-bank-backend` directory:

    ```bash
    cd Blood-bank-backend
    ```

2. Create a virtual environment and activate it:

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install the dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Set up the database:

    ```bash
    python manage.py migrate
    ```

5. Run the server:

    ```bash
    python manage.py runserver
    ```
    To run the server in your local network
   ```bash
   python manage.py runserver 192.168.0.2
   ```
   Replace 192.168.0.2 with your local network IP
   
### Environment Variables

To run the project locally, you need to create a `.env` file in the `Blood-bank-backend/smile` directory and populate it with the required environment variables. Below are the instructions to set up the `.env` file.

#### Creating the .env File

1. Navigate to the `Blood-bank-backend/smile` directory:

    ```bash
    cd Blood-bank-backend/smile
    ```

2. Create a `.env` file:

    ```bash
    touch .env
    ```

3. Open the `.env` file in a text editor and add the following environment variables:

    ```plaintext
    SECRET_KEY=your_secret_key

    DB_ENGINE=your_database_engine
    DB_HOST=your_database_host
    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_PORT=your_database_port
    EMAIL_HOST=smtp.your_email_provider.com
    EMAIL_PORT=your_email_port
    EMAIL_HOST_USER=your_email@example.com
    EMAIL_HOST_PASSWORD=your_email_password
    EMAIL_USE_TLS=True
    EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
    ALLOWED_HOSTS=your_allowed_ip_and_hosts
    CORS_ALLOWED_AND_CSRF_TRUSTED_ORIGINS=your_cors_allowed_and_csrf_trusted_origins
    ```

    Replace `your_secret_key`, `your_database_name`, `your_database_user`, `your_database_password`, `your_database_host`, `your_database_port`, `your_email_provider`, `your_email_port`, `your_email@example.com`, and `your_email_password` with your actual values.
    Replace `your_allowed_ip_and_hosts` with your ip addresses and host name, ( example: www.yourhostname.com,127.0.0.1,localhost ) with comma separated values as shown in the example.
    Replace `your_cors_allowed_and_csrf_trusted_origins` with the ip addresses and host origins you want to allow ( example: https://yourwebsite.com,http://127.0.0.1,http://localhost ) with comma separated value as shown in the example.


### Modifying the Code to Use Environment Variables

1. Open the `settings.py` file in the `backend` directory:

    ```bash
    backend/smile/settings.py
    ```

2. Modify the database settings to use the environment variables:

    ```python
    import os
    from pathlib import Path
    from dotenv import load_dotenv

    load_dotenv()

    BASE_DIR = Path(__file__).resolve().parent.parent

    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = True

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT'),
        }
    }

    EMAIL_BACKEND = os.environ.get('django.core.mail.backends.smtp.EmailBackend')
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_PORT = os.environ.get('EMAIL_PORT')
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
    ```

By following these instructions, you will configure your Django application to use environment variables stored in a `.env` file, ensuring sensitive information like secret keys and database credentials are kept secure.

### Docker Setup

1. Ensure Docker and Docker Compose are installed.

2. Navigate to your local GitHub branch and pull the latest changes:
     ```bash
    git checkout master
    git pull origin master
    ```

4. Build and start the Docker containers:

    ```bash
    docker-compose up --build
    ```

## Usage

- Visit `http://localhost` or your local network IP (example: http://192.168.0.2) in your browser to see the website.
- Admins can log in to the admin panel at `http://localhost/admindashboard` or `http://192.168.0.2/admindashboard`.
- Do not forget to add your host name or local network IP in the ALLOWED_HOSTS and CORS_ALLOWED_AND_CSRF_TRUSTED_ORIGINS in the .env file
  
## Contributors

- **Shauvik Paul**: Frontend Development and DevOps
  - [GitHub](https://github.com/paulShauvik99)
  - [LinkedIn](www.linkedin.com/in/shauvik-paul20)
- **Gourab Das**: Backend Development and DevOps
  - [GitHub](https://github.com/gdas37467)
  - [LinkedIn](https://www.linkedin.com/in/gourabdas137)


## Contact Developer

For any inquiries or support, please contact us at [gdas37467@gmail.com](mailto:gdas37467@gmail.com) or [paul99shauvik108@gmail.com](mailto:paul99shauvik108@gmail.com).

# Receipt Approval and Logging Application

This web application is designed to streamline the process of submitting, reviewing, and approving receipts. It is specifically tailored to the needs of college societies in Ireland, such as the Enactus DCU society, but can be easily adapted for other use cases. The frontend is built with React, while the backend utilizes Django.

## Features

- User registration and login using Simple JSON Web Tokens and Django REST Framework, with a confirmation email sent to all new sign ups.
- User accounts include IBAN for administrators to easily facilitate reimbursement for approved payments.
- Users can submit receipts by uploading an image and providing details about the receipt, such as the date, purchase amount and reason.
- All users and receipts (as well as each users associated receipts) are stored in a MySQL 5.7  DB or greater.
- Administrators can view a list of all submitted receipts and mark them as approved or rejected.
- Approved receipts are automatically written to a Google Sheet for tracking and reporting purposes.


## Requirements

- [Python 3.8](https://www.python.org/) or higher
- [Django 4.0](https://www.djangoproject.com/) or higher
- [MySQL 5.7 DB](https://dev.mysql.com/) or higher
- [React 16.13](https://reactjs.org/) or higher
- [Google Sheets API](https://developers.google.com/sheets/api) credentials

## Set Up
### For Django Backend:
1. Create a .env file in backend/ to store the following fields:
```env
# MySQL database credentials
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_HOST=
MYSQL_PORT=

# Django secret key
SECRET_KEY=

# Google Sheet Client Secret Path
GOOGLE_SHEETS_CLIENT_SECRET_PATH=
GOOGLE_SHEET_ID=

EMAIL_HOST_USER = 
EMAIL_HOST_PASSWORD = 
EMAIL_HOST = 
DEFAULT_FROM_EMAIL =
```
2. Create a new virtual environment using `python3 -m venv env` and activate it using `env\Scripts\activate.bat`.
3. Install the required packages using `pip install -r requirements.txt` from the backend/ directory.
4. Create a new MySQL database and update the `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, and `MYSQL_PORT` variables in the `.env` file with the corresponding values.
5. Generate a Django secret key and update the `SECRET_KEY` variable in the `.env` file.
6. Obtain Google Sheets API credentials and update the `GOOGLE_SHEETS_CLIENT_SECRET_PATH` and `GOOGLE_SHEET_ID` variables in the `.env` file with the corresponding values.
7. Obtain service account secret credentials from the Google Cloud platform in the form of a JSON and place it in backend/ directory.
8. Update the `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_HOST`, and `DEFAULT_FROM_EMAIL` variables in the `.env` file with the email account and host information that will be used to send confirmation emails.
9. Run the following command to set up the database and create a superuser: `python manage.py migrate` and `python manage.py createsuperuser`.
10. Start the development server using `python manage.py runserver`.
11. Navigate to http://localhost:8000/ in your browser to view the app.


### For React Frontend:
1. From the frontend/ directory, run npm install
2. Once dependencies are installed, create a production build: npm run build 

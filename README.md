# Receipt Approval and Logging Application

This is a web app that allows users to submit receipts for approval, and administrators to review and approve the receipts. The app has a frontend built with React and a backend built with Django.

## Features

- User registration and login using Simple JSON Web Tokens and Django REST Framework, with a confirmation for all new sign ups.
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

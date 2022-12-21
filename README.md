# Receipt Approval / Logging App

This is a web app that allows users to submit receipts for approval, and administrators to review and approve the receipts. The app has a frontend built with React and a backend built with Django.

## Features

- Users can submit receipts by uploading an image and providing details about the receipt, such as the store name and the purchase amount.
- Administrators can view a list of all submitted receipts and mark them as approved or rejected.
- Approved receipts are automatically added to a Google Sheet for tracking and reporting purposes.
- The app uses Firebase for user authentication and authorization, so that only authorized users can submit or approve receipts.

## Requirements

- [Python 3.8](https://www.python.org/) or higher
- [Django 4.0](https://www.djangoproject.com/) or higher
- [React 16.13](https://reactjs.org/) or higher
- [Firebase](https://firebase.google.com/) account and project
- [Google Sheets API](https://developers.google.com/sheets/api) credentials

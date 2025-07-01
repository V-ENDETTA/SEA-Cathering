SEA Catering App
A modern web-based catering subscription system built for managing healthy meal plans. This project was developed step-by-step through security-conscious and feature-rich design, featuring user subscriptions, admin analytics, authentication, dashboards, and more.

Table of Contents:
Installation & Usage
Tech Stack
Project Structure
Author

Installation & Usage
1. Clone Repository
git clone https://github.com/V-ENDETTA/SEA-Catering.git
cd SEA-Catering

2. Install Dependencies
npm install

3. Run the Server
node server.js

4. Open Frontend
Just open index.html or subscription.html in your browser, or serve it with Live Server.

Tech Stack
| Frontend      | Backend           | Database |
| ------------- | ----------------- | -------- |
| HTML, CSS, JS | Node.js + Express | SQLite   |

Project Structure
SEA-Catering/
│
├── index.html                  # Homepage
├── subscription.html           # Subscription form
├── dashboard_user.html         # User Dashboard
├── dashboard_admin.html        # Admin Dashboard
├── server.js                   # Main backend server
├── models/
│   └── db.js                   # SQLite database connection
├── middleware/
│   └── auth.js                 # (If implemented) auth middlewares
├── public/                     # Static assets
│   └── style.css
├── README.md
└── package.json

Author
Univesia B.
GitHub: V-ENDETTA

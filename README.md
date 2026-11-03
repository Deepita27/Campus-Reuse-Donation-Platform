# CAMPUS REUSE & DONATION PLATFORM

> **Tagline:** *"Give What You Don't Need. Get What You Do."*

A modern, responsive, and full-featured full-stack web application designed exclusively for college campus communities. It connects students across all academic departments to donate, request, and exchange reusable textbooks, electronic accessories, lab equipment, stationery, clothing, and dorm essentials—reducing campus landfill waste and saving students thousands of dollars each semester.

---

## 🌟 Key Highlights & Features

### 1. 🎓 Student Experience
* **Campus Authentication:** Register with college email, roll number, department, and academic year. Secured with JWT tokens and bcrypt password hashing.
* **Smart Marketplace:** Browse and search items across 8 campus categories, filter by condition (*New, Like New, Good, Fair*), sort by newest/views, and check pickup locations.
* **Donation Submission:** Upload photos via Multer, specify condition and campus pickup points. Submissions enter a *Pending* review state for administrator quality control.
* **Request Management:** Submit item requests with customized notes and meetup time preferences. Donors review and Accept, Reject, or Complete peer handovers.
* **Student Dashboard:** Track personal donation statistics, outgoing item requests, incoming requests needing attention, and circular economy milestones.
* **In-App Notifications:** Real-time bell notifications for request status updates (*Received, Accepted, Rejected, Completed, Listing Approved*).

### 2. 🛡️ Administrative Command Center
* **Live KPI Overview:** Monitor registered students, total donations, available listings, pending approvals, completed exchanges, and peer requests.
* **Item Moderation:** Approve, reject (with custom feedback reason), or delete inappropriate listings.
* **User Management:** Search students, inspect enrollment details, and block/unblock accounts to safeguard campus community integrity.
* **Request Monitoring:** Audit all peer exchanges across departments in real-time.
* **Interactive Analytics (Recharts):** Visual bar charts for popular categories, line charts for monthly donation trends, and environmental sustainability scorecards (kg waste diverted, CO2 avoided, dollar savings).

### 3. 👥 Guest Experience
* **Engaging Landing Page:** Hero showcase, platform statistics, how-it-works workflow, circular sharing impact, and guest marketplace browsing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Tailwind CSS, Lucide React, Recharts |
| **Backend** | Node.js, Express.js RESTful API, Multer (multipart image upload), CORS, Dotenv |
| **Database** | MongoDB with Mongoose ODM (Includes zero-setup auto-starting embedded MongoDB engine for evaluation) |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js password hashing, Role-Based Access Control |

---

## 🎨 Design System & Color Palette

Designed with a clean, modern, eco-conscious aesthetic:
* **Primary (Forest Green):** `#176B4D`
* **Secondary (Light Green):** `#DDF3E4`
* **Background (Off White):** `#F8FAF7`
* **Accent (Soft Warm Yellow):** `#F4C95D`
* **Text (Dark Charcoal):** `#26332D`

---

## 📂 Project Structure

```
campus-reuse-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Dual-mode MongoDB connector (Local / Atlas / Embedded)
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Session, Profile, Change Password
│   │   ├── itemController.js     # CRUD donations, filter, search, featured, category stats
│   │   ├── requestController.js  # Create request, accept, decline, complete, cancel
│   │   ├── adminController.js    # KPIs, user moderation, item review, Recharts analytics
│   │   └── notificationController.js # In-app notification center
│   ├── middleware/
│   │   ├── auth.js               # JWT verification, Role authorization, Optional auth
│   │   └── upload.js             # Multer image upload & file validation
│   ├── models/
│   │   ├── User.js               # Student & Admin user schema
│   │   ├── Item.js               # Donation item schema with indexes
│   │   ├── Request.js            # Peer-to-peer exchange request schema
│   │   └── Notification.js       # In-app notifications schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── adminRoutes.js
│   │   └── notificationRoutes.js
│   ├── uploads/                  # Uploaded item photos
│   ├── utils/
│   │   └── seeder.js             # Realistic campus demo dataset seeder
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js                 # Express server with unified SPA fallback
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ItemCard.jsx      # Modern item product card
│   │   │   ├── StatusBadge.jsx   # Status, availability & condition badges
│   │   │   ├── RequestModal.jsx  # Item request dialog
│   │   │   ├── ConfirmModal.jsx  # Reusable confirmation dialog
│   │   │   └── EmptyState.jsx    # Clean empty illustrations
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & JWT handling
│   │   │   └── NotificationContext.jsx # In-app notifications state
│   │   ├── layouts/
│   │   │   ├── Navbar.jsx        # Responsive navigation with badge & dropdowns
│   │   │   └── Footer.jsx        # Eco-themed campus footer
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Page 1: Hero, Stats, Categories, Impact
│   │   │   ├── LoginPage.jsx     # Page 2: Student & Admin login with demo autofills
│   │   │   ├── RegisterPage.jsx  # Page 2: Student registration form
│   │   │   ├── StudentDashboard.jsx # Page 3: 4 stats cards, activities, requests
│   │   │   ├── BrowseItemsPage.jsx  # Page 4: Filterable & searchable marketplace
│   │   │   ├── DonateItemPage.jsx   # Page 5: Donation submission form
│   │   │   ├── ItemDetailsPage.jsx  # Page 6: Full item page with request button
│   │   │   ├── ReceivedRequestsPage.jsx # Page 7: Incoming peer request management
│   │   │   ├── MyDonationsPage.jsx  # Page 8: Manage donated listings
│   │   │   ├── MyRequestsPage.jsx   # Page 9: Track sent requests & status
│   │   │   ├── AdminDashboard.jsx   # Page 10: Admin command center with Recharts
│   │   │   └── ProfilePage.jsx   # Student profile & password settings
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx # Route guard for students & admins
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind setup & styling
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Running Instructions

### 1. Requirements
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* *(Optional)* MongoDB locally installed or MongoDB Atlas URI. **If no local MongoDB is detected, the application automatically launches an embedded in-memory MongoDB engine with realistic seed data ready for demonstration!**

### 2. Start the Application
Simply navigate to the backend folder and start the server:

```powershell
cd d:\campus-reuse-platform\backend
npm start
```

Open your browser at:
👉 **`http://localhost:5000`**

The entire web application (both the React frontend and Express backend APIs) will be live and ready for testing!

---

## 🔑 Demo Login Credentials

For evaluation and testing convenience, convenient demo accounts are pre-seeded into the database:

### Administrator Account
* **Email:** `admin@campus.edu`
* **Password:** `AdminPassword123!`
* **Role:** Campus Administrator
* **Access:** Administrative dashboard, item approvals, user suspension, analytics.

### Student Accounts
| Student Name | Email | Password | Department & Year |
| :--- | :--- | :--- | :--- |
| **Alex Johnson** | `alex@campus.edu` | `StudentPass123!` | Computer Science (3rd Year) |
| **Priya Sharma** | `priya@campus.edu` | `StudentPass123!` | Mechanical Engineering (4th Year) |
| **Liam Martinez** | `liam@campus.edu` | `StudentPass123!` | Electrical Engineering (2nd Year) |
| **Sophia Chen** | `sophia@campus.edu` | `StudentPass123!` | Biotechnology (3rd Year) |
| **Marcus Vance** | `marcus@campus.edu` | `StudentPass123!` | Business Administration (1st Year) |

*(Note: On the login page, you can also click the quick **"Student Demo"** or **"Admin Demo"** buttons to auto-populate credentials in one click!)*

---

## 📡 RESTful API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new student
* `POST /api/auth/login` - Authenticate user & return JWT
* `GET /api/auth/me` - Get current session profile *(Protected)*
* `PUT /api/auth/profile` - Update student profile details *(Protected)*
* `PUT /api/auth/change-password` - Change account password *(Protected)*

### Items (`/api/items`)
* `GET /api/items` - Browse approved items with search, category, condition filters, and pagination
* `GET /api/items/featured` - Get top featured items for landing page
* `GET /api/items/categories` - Get item counts per category
* `GET /api/items/:id` - Get single item details & check request status
* `POST /api/items` - Create donation listing with Multer image upload *(Protected)*
* `PUT /api/items/:id` - Update existing item listing *(Protected - Donor or Admin)*
* `DELETE /api/items/:id` - Delete item listing *(Protected - Donor or Admin)*
* `GET /api/items/user/my-donations` - Retrieve items donated by current student *(Protected)*

### Requests (`/api/requests`)
* `POST /api/requests` - Request an available item *(Protected - Student)*
* `GET /api/requests/my-requests` - Get items requested by current student *(Protected)*
* `GET /api/requests/received` - Get incoming requests for current student's items *(Protected)*
* `PUT /api/requests/:id/status` - Accept, Reject, Complete, or Cancel request *(Protected)*

### Admin (`/api/admin`)
* `GET /api/admin/dashboard` - Get administrative metrics and overview *(Admin only)*
* `GET /api/admin/users` - View and search registered students *(Admin only)*
* `PUT /api/admin/users/:id/toggle-block` - Suspend or reactivate student account *(Admin only)*
* `GET /api/admin/items` - Retrieve all items across all statuses *(Admin only)*
* `PUT /api/admin/items/:id/approve` - Approve item listing *(Admin only)*
* `PUT /api/admin/items/:id/reject` - Reject item listing with reason *(Admin only)*
* `DELETE /api/admin/items/:id` - Delete inappropriate item listing *(Admin only)*
* `GET /api/admin/requests` - View and monitor all system requests *(Admin only)*
* `GET /api/admin/analytics` - Recharts analytics data (categories, trends, eco impact) *(Admin only)*

### Notifications (`/api/notifications`)
* `GET /api/notifications` - Get user notifications with unread counter *(Protected)*
* `PUT /api/notifications/:id/read` - Mark specific notification as read *(Protected)*
* `PUT /api/notifications/read-all` - Mark all notifications as read *(Protected)*

---

## ♻️ Academic & Community Impact
By encouraging campus reuse of textbooks, lab kits, safety gear, and electronic microcontrollers:
1. **Reduces Waste:** Eliminates unnecessary landfill disposal at semester turnarounds.
2. **Promotes Equity:** Ensures freshmen and lower-income students can access required coursework materials at no cost.
3. **Builds Community:** Facilitates peer mentorship across senior and junior students within the university.

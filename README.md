# Medicine Reminder & Management System 💊

A full-stack web application built with **Java 21**, **Spring Boot 3**, **Spring Security**, **JWT**, **Spring Data MongoDB**, and **React** (Vite + Axios + React Router). 

Designed as a clean, professional, beginner-readable portfolio project for B.Tech Computer Science technical interviews.

---

## 🏗️ Architecture Diagram

```text
+-------------------------------------------------------------+
|                      React Frontend                         |
|      (Vite + React Router + Axios Interceptors + Context)   |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON REST API
                              |
                              v
+-------------------------------------------------------------+
|                     Spring Boot 3 Backend                   |
|                                                             |
|  [SecurityFilter] -> JwtAuthenticationFilter                |
|           |                                                 |
|           v                                                 |
|     [Controller]   -> AuthController, MedicineController    |
|           |                                                 |
|           v                                                 |
|      [Service]     -> AuthServiceImpl, MedicineServiceImpl  |
|           |            (User Ownership Isolation)           |
|           v                                                 |
|     [Repository]  -> UserRepository, MedicineRepository    |
+-------------------------------------------------------------+
                              |
                     Spring Data MongoDB
                              |
                              v
+-------------------------------------------------------------+
|                     MongoDB Database                        |
|                  (Collections: users, medicines)            |
+-------------------------------------------------------------+
```

---

## 🌟 Key Features

1. **User Authentication & Authorization**:
   - Secure Registration & Login with JWT Tokens (`Bearer` Authorization header).
   - BCrypt Password Hashing (`PasswordEncoder`). Passwords are never stored as plain text and never exposed in API responses.
2. **Multi-Tenant Data Isolation (Crucial Security Rule)**:
   - Users can **ONLY** view, update, delete, or mark as taken their own medicines.
   - Ownership is strictly enforced at the repository layer (`findByUserId` & `findByIdAndUserId`).
3. **Medicine CRUD & Management**:
   - Add new medicines with dosage, frequency, start/end dates, reminder time, and special instructions.
   - View all prescriptions or inspect detailed medicine records.
   - Update prescription schedules or delete records with confirmation modals.
   - Quick **Mark as Taken** button that updates daily status and records `lastTakenAt` timestamps.
4. **Real-time Web Audio & Visual Alarm System**:
   - Continuously checks active medicine schedules every 10 seconds against system clock (`HH:mm`).
   - Plays a pleasant dual-tone Healthcare Chime using the browser's native **Web Audio API** (`AudioContext`).
   - Pops up a high-priority **Alarm Alert Modal** with "Mark as Taken" and "Snooze/Dismiss" actions.
   - Sends desktop notifications via browser `Notification` API.
5. **External U.S. FDA Drug Safety API Integration**:
   - Integrates with the official public **U.S. Food & Drug Administration (OpenFDA)** REST API (`https://api.fda.gov/drug/label.json`).
   - Fetches brand names, generic names, active ingredients, usage indications, and official FDA warnings directly into medicine details.
5. **Live Search & Filter**:
   - Real-time search by medicine name.
   - Filter medicines by status: `ACTIVE`, `TAKEN`, `INACTIVE`, `COMPLETED`.
6. **Interactive Dashboard**:
   - Stat overview widgets showing Total Prescriptions, Active Medicines, Taken Today, and Upcoming Reminders.
7. **Centralized Exception Handling & Validation**:
   - `@RestControllerAdvice` returning standard JSON error responses (`ErrorResponse`).
   - Bean Validation (`@NotBlank`, `@Email`, `@Size`, `@NotNull`).

---

## 🛠️ Technology Stack

- **Backend**: Java 21, Spring Boot 3.3.4, Spring Web, Spring Security, Spring Data MongoDB, JJWT 0.12.6, Bean Validation, JUnit 5 & Mockito.
- **Database**: MongoDB (Local or Atlas URI).
- **Frontend**: React 18, Vite 5, React Router DOM 6, Axios, Lucide Icons, Modern Healthcare Glassmorphic CSS.

---

## 📁 Directory Structure

```text
medicine-reminder/
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jnaneswar/medicinereminder/
│   │   │   │   ├── config/             # CorsConfig, SecurityConfig
│   │   │   │   ├── controller/         # AuthController, MedicineController
│   │   │   │   ├── dto/                # Request & Response DTOs
│   │   │   │   ├── exception/          # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── model/              # User, Medicine, MedicineStatus
│   │   │   │   ├── repository/         # UserRepository, MedicineRepository
│   │   │   │   ├── security/           # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   │   │   ├── service/            # AuthService, MedicineService & Impls
│   │   │   │   └── MedicineReminderApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                       # AuthServiceTest, MedicineServiceTest
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/                        # axiosInstance.js
        ├── components/                 # Navbar, Sidebar, MedicineCard, StatsCard, ConfirmModal, ProtectedRoute
        ├── context/                    # AuthContext.jsx
        ├── pages/                      # LoginPage, RegisterPage, DashboardPage, AddMedicinePage, EditMedicinePage, MedicineDetailPage, ProfilePage
        ├── services/                   # authService.js, medicineService.js
        ├── styles/                     # index.css
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Environment Variables & Configuration

Configuration is located in `backend/src/main/resources/application.properties`:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/medicine_reminder_db` |
| `JWT_SECRET` | 256-bit secret key for signing JWTs | *(Configured default HMAC-SHA key)* |
| `JWT_EXPIRATION_MS` | Token validity period in ms | `86400000` (24 Hours) |
| `PORT` | Spring Boot server port | `8080` |

---

## 🚀 How to Run the Project

### Prerequisites
- Java 21 JDK installed
- MongoDB Server running on `localhost:27017`
- Node.js (v18 or v20+) & npm

---

### Step 1: Start MongoDB
Ensure MongoDB is running locally:
```powershell
net start MongoDB
```

---

### Step 2: Start Spring Boot Backend
Navigate to the `backend` folder and run Maven test / bootRun:

```powershell
cd medicine-reminder/backend
./mvnw spring-boot:run
```
*(Or run using your IDE: `MedicineReminderApplication.java`)*

The backend will start at: **`http://localhost:8080`**

---

### Step 3: Start React Frontend
Navigate to the `frontend` folder and start the Vite dev server:

```powershell
cd medicine-reminder/frontend
npm run dev
```

The frontend will start at: **`http://localhost:5173`**

---

## 📚 API Endpoints & Documentation

### 1. Authentication Endpoints (Public)

#### `POST /api/auth/register`
Creates a new user account.

- **Request Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Response (201 Created)**:
```json
{
  "id": "66d9f8e4a1b2c3d4e5f67890",
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "role": "USER"
}
```

#### `POST /api/auth/login`
Authenticates credentials and generates a JWT.

- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "66d9f8e4a1b2c3d4e5f67890",
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "role": "USER"
  }
}
```

---

### 2. Medicine Management Endpoints (Requires `Authorization: Bearer <token>`)

#### `POST /api/medicines`
Create a new medicine record for the authenticated user.

- **Request Body**:
```json
{
  "name": "Paracetamol",
  "dosage": "500mg",
  "frequency": "Twice a day",
  "startDate": "2026-09-01",
  "endDate": "2026-09-10",
  "reminderTime": "09:00",
  "instructions": "Take after food",
  "status": "ACTIVE"
}
```
- **Response (201 Created)**:
```json
{
  "id": "66d9f912a1b2c3d4e5f67891",
  "name": "Paracetamol",
  "dosage": "500mg",
  "frequency": "Twice a day",
  "startDate": "2026-09-01",
  "endDate": "2026-09-10",
  "reminderTime": "09:00",
  "instructions": "Take after food",
  "status": "ACTIVE",
  "createdAt": "2026-09-06T20:17:46"
}
```

#### `GET /api/medicines`
Retrieves medicines belonging **ONLY** to the authenticated user. Supports optional `search` and `status` query parameters.

- **Query Parameters**: `?search=Paracetamol&status=ACTIVE`
- **Response (200 OK)**: `[ { ... medicine object ... } ]`

#### `GET /api/medicines/{id}`
Get medicine details by ID (enforces user ownership).

- **Response (200 OK)**: `{ ... medicine object ... }`
- **Error Response (404 Not Found)**:
```json
{
  "status": 404,
  "message": "Medicine not found with id: 66d9f912a1b2c3d4e5f67891"
}
```

#### `PUT /api/medicines/{id}`
Update medicine record by ID (enforces user ownership).

- **Response (200 OK)**: `{ ... updated medicine object ... }`

#### `DELETE /api/medicines/{id}`
Deletes medicine record by ID (enforces user ownership).

- **Response (204 No Content)**

#### `PATCH /api/medicines/{id}/taken`
Marks a medicine as taken today and records `lastTakenAt`.

- **Response (200 OK)**: `{ ... medicine object with status TAKEN ... }`

---

### 3. External FDA Drug Safety API Endpoint

#### `GET /api/drugs/info?name={medicineName}`
Fetches official drug label, active ingredients, and safety warnings from the public U.S. FDA REST API database.

- **Query Parameter**: `?name=Ibuprofen`
- **Response (200 OK)**:
```json
{
  "found": true,
  "query": "Ibuprofen",
  "brandName": "Ibuprofen",
  "genericName": "IBUPROFEN",
  "purpose": "Pain reliever/fever reducer",
  "activeIngredient": "Ibuprofen 200 mg",
  "warnings": "Allergy alert: Ibuprofen may cause a severe allergic reaction...",
  "usage": "Temporarily relieves minor aches and pains due to..."
}
```

---

## 🧪 Testing

Run backend automated unit & security tests:

```powershell
cd medicine-reminder/backend
./mvnw test
```

Tests verify user registration, authentication error cases, medicine creation, multi-tenant isolation (`findByUserId`), and mark-as-taken operations.

---

## 🖼️ Application Screenshots Placeholder

*(Place UI screenshots here when presenting in technical portfolio)*
- Dashboard View
- Prescription Card Grid & Filter
- Add/Edit Medicine Modal Form
- Mobile View Responsiveness

---

## 🚀 Future Improvements

1. Browser Web Push Notifications for reminder alarms.
2. Integration with email/SMS notification services (Twilio or JavaMail).
3. Export prescription reports as PDF for doctor visits.

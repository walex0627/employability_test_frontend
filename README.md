

# 🚀 Riwi Jobs - Frontend

A comprehensive job vacancy and employability management system built with **React**, **Vite**, and **Tailwind CSS**. This platform enables recruiters to manage job offers seamlessly and allows coders to apply for opportunities efficiently.

## 🛠️ Tech Stack

* **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **API Client:** [Axios](https://axios-http.com/)
* **Routing:** [React Router DOM](https://reactrouter.com/)

## 📋 Prerequisites

* **Node.js** (Version 18 or higher recommended)
* **Package Manager:** `npm` or `yarn`

## ⚙️ Project Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/riwi-jobs-frontend.git
cd riwi-jobs-frontend

```


2. **Install dependencies:**
```bash
npm install

```


3. **Environment Variables:**
Create a `.env` file in the root directory and configure the following variables:
```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your_secret_api_key

```



## 🚀 Development Execution

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev

```

The application will be available at `http://localhost:5173`.

## 🏗️ Folder Structure

```text
src/
├── api/           # Axios configuration and security interceptors
├── components/    # Reusable components (Modals, Navbar, ProtectedRoute)
├── context/       # AuthContext for session and role management
├── pages/         # Main views (Admin Dashboard, Coder Dashboard, Login)
├── types/         # TypeScript definitions and API interfaces
├── App.tsx        # Protected routing configuration
└── main.tsx       # Application entry point

```

## 🔐 Key Features

* **Authentication:** JWT-based auth with persistence in `localStorage`.
* **Protected Routes:** RBAC (Role-Based Access Control) distinguishing between `admin` and `coder` roles.
* **Vacancy Management (Admin):**
* Dynamic Creation/Edition via Modal with DTO validation (Seniority, Modality, etc.).
* Secure Deletion (Supports backend CASCADE delete logic).
* **Applicant Tracking:** Detailed list view of all users who applied to a specific vacancy.


* **Opportunities Panel (Coder):**
* One-click application process.
* Real-time vacancy capacity validation (Applicants Fill).
* Duplicate detection to prevent multiple applications to the same offer.



## 🛠️ Troubleshooting (Common Fixes)

* **404 Errors:** Ensure `VITE_API_URL` matches your Backend port and global prefix.
* **Infinite Redirects:** Solved by preventing `ProtectedRoute` and `Login` from triggering simultaneous navigation updates.
* **Database Constraints:** If a vacancy cannot be deleted, ensure the Backend has `onDelete: 'CASCADE'` configured in the Applications entity.

## 👥 Test Users

The application comes with pre-configured users to easily test the different roles and permissions.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@riwi.io` | `Riwi123!` |
| **Hiring Manager (Gestor)** | `manager@riwi.io` | `Riwi123!` |
| **Coder** | `coder@riwi.io` | `Riwi123!` |

> **Note**: You will need to use these credentials to get a JWT token via the login endpoint to access protected routes.

## 🤝 Contribution

1. Fork the project.
2. Create a new branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

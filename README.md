# DigitalVidyaSaarthi Super Admin (dvssuper)

## 🎯 Overview

The super admin dashboard for DigitalVidyaSaarthi system. Built with React and Vite, it provides comprehensive administrative control over multiple schools and third-party integrations.

## 🔧 Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Routing**: React Router v7
- **Charts**: Chart.js, React Chart.js 2
- **UI Components**: Headless UI, React Icons
- **HTTP Client**: Axios
- **Development**: ESLint, Hot Module Replacement

## ✨ Features

### 🏢 Multi-School Management
- **School Overview**: Manage multiple school instances
- **Performance Analytics**: Cross-school performance metrics
- **Resource Allocation**: Distribute resources across schools
- **Centralized Reporting**: Unified reporting dashboard

### 👥 Super Admin Controls
- **User Management**: Create and manage super admin accounts
- **System Configuration**: Global system settings
- **Access Control**: Manage permissions and roles
- **Audit Logs**: Track system-wide activities

### 🔗 Third-Party Integration
- **Partner Management**: Manage third-party service providers
- **API Integration**: Configure external service connections
- **Data Synchronization**: Sync data across platforms
- **Service Monitoring**: Monitor third-party service health

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Environment Setup:**
```bash
cp .env.example .env
```

3. **Configure Environment Variables:**
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_NAME=DigitalVidyaSaarthi Super Admin
VITE_APP_VERSION=2.0.0
```

4. **Start Development Server:**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

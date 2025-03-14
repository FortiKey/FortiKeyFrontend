This is the frontend application for FortiKey, a two-factor authentication (2FA) platform that enables businesses to protect their users' accounts with a secure second layer of authentication.

## Overview

The FortiKey frontend provides a responsive, feature-rich dashboard for businesses to:
- Manage API keys for 2FA integration
- View usage analytics for 2FA authentication
- Access detailed API documentation
- Monitor user accounts and security metrics

## Setup and Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FortiKeyFrontend/fortikeyfrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```
   REACT_APP_API_URL=https://fortikeybackend.onrender.com/api/v1
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## Available Scripts

- **`npm start`**: Runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- **`npm test`**: Launches the test runner in interactive watch mode
- **`npm run test:coverage`**: Runs tests with coverage reporting
- **`npm run build`**: Builds the app for production to the `build` folder
- **`npm run eject`**: Ejects from Create React App (one-way operation)

## Frontend Architecture

The application follows a component-based architecture using React:

- **Pages**: Complete views like Dashboard, Login, API Documentation
- **Components**: Reusable UI elements across multiple pages
- **Services**: API interaction layer with Axios
- **Context**: For state management across components
- **Theme**: Material UI theme configuration
- **Utils**: Helper functions and utilities

## Key Libraries and Technologies

### Core Libraries
- React (v19.0.0)
- React Router (v6.29.0)
- Axios (v1.8.1)

### UI Framework
- Material UI (v6.4.5)
- React Pro Sidebar (v0.7.1)

### Data Visualization
- Chart.js (v4.4.8) with React-Chartjs-2 (v5.3.0)

### Specialized Components
- React Syntax Highlighter (v15.6.1)

### Testing Framework
- Jest with React Testing Library

### Development and Performance
- Web Vitals (v2.1.4)

## Testing

Tests are located in the `src/tests` directory and follow the naming convention `*.test.js` or `*.test.jsx`.

To run tests with coverage reporting:
```bash
npm run test:coverage
```

## Deployment

The frontend is deployed on Netlify with continuous integration from the main branch. Production builds are automatically generated when changes are merged to the main branch.

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # React context providers
├── pages/           # Page components
├── services/        # API service layer
├── tests/           # Test files
├── theme/           # Theme configuration
├── utils/           # Utility functions
├── App.jsx          # Main App component
└── index.js         # Application entry point
```

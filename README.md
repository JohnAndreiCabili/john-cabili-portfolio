# John Andrei Cabili - Portfolio

## Installation Guide

This document provides instructions to set up and run this portfolio project on your local machine.

### System Requirements

- **Node.js**: Version 16.x or newer
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation with: `node --version`

- **npm**: Version 7.x or newer (comes with Node.js)
  - Verify installation with: `npm --version`

- **Git**: Any recent version
  - Download from [git-scm.com](https://git-scm.com/downloads)
  - Verify installation with: `git --version`

- **Modern web browser**: Chrome, Firefox, Safari, or Edge (latest versions recommended)

### Step-by-Step Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/JohnAndreiCabili/john-cabili-portfolio.git
   cd john-cabili-portfolio
   ```

   Note: If downloading as a ZIP file instead, extract it to your preferred location.

2. **Install Dependencies**

   From the project root directory, run:

   ```bash
   npm install
   ```

   This will install all required packages from package.json. The process may take a few minutes depending on your internet connection.

3. **Start the Development Server**

   After successful installation, start the local development server:

   ```bash
   npm start
   ```

   This command will:
   - Compile the project
   - Start a local development server
   - Automatically open the project in your default web browser

   If the browser doesn't open automatically, visit: http://localhost:3000

4. **Troubleshooting Common Issues**

   - **"Port 3000 is already in use"**: Either close the application using port 3000 or run:
     ```bash
     npm start -- --port 3001
     ```

   - **Module not found errors**: Try running `npm install` again to ensure all dependencies are properly installed

   - **Node.js version conflicts**: Ensure you're using a compatible Node.js version (16.x or newer)

### Building for Production (Optional)

If you need to create a production build:

1. **Generate optimized build files**:

   ```bash
   npm run build
   ```

2. **Serve the production build locally** (requires a static server):

   ```bash
   npx serve -s build
   ```

   The site will be available at: http://localhost:3000

### Project Structure Overview

- `/public` - Static assets and HTML template
- `/src` - Application source code
  - `/pages` - Page components
  - `/components` - Reusable UI components

## Contact Information

For technical assistance or inquiries:
- Email: johnandreicabili@gmail.com
- GitHub: https://github.com/JohnAndreiCabili

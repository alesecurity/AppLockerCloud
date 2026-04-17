# AppLocker Policy Creator

A web-based tool for creating and managing Windows AppLocker policies. Create application control rules through an intuitive interface and export them as valid AppLocker XML files for use with Windows Group Policy or Microsoft Intune.

## Screenshots

<img width="1715" height="1297" alt="image" src="https://github.com/user-attachments/assets/08478eee-cb79-4d27-bbcf-d3a1926312f4" />

## Requirements

- **Node.js 16+** and **npm** - Required for the frontend

## Quick Start

1. Make sure you have Node.js 16+ and npm installed
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The application will start at **http://localhost:3000** and runs entirely in your browser. All data is stored locally using browser localStorage - no backend server required!

5. Press `Ctrl+C` to stop the development server when done

## Building for Production

To build a production version:
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory and can be served by any static web server.

## Build and run it with Docker

Build the container first with:
```bash
docker build -t applockercloud:latest .
```
The Docker build process builds the production version and creates an nginx container ready to host the site.
Run the container and host it on port 80:
```bash
docker run --rm -d -p 80:80 --name applockercloud applockercloud:latest
```

## What It Does

This tool provides a visual interface to create AppLocker rules for:
- Executables (.exe, .com)
- Scripts (.ps1, .bat, .cmd, .vbs, .js)
- DLLs (.dll, .ocx)
- Windows Installers (.msi, .msp, .mst)
- Packaged Apps (UWP/MSIX)

You can create rules based on file paths, publisher certificates, or file hashes, then export the complete policy as an XML file ready for deployment.

The tool also provides tips to make sure the policy is hardened against common known attacks.

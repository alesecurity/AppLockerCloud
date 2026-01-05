#!/bin/bash
# Startup script for AppLocker Policy Creator (Client-side only)

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# PID file for cleanup
FRONTEND_PID_FILE="$SCRIPT_DIR/.frontend.pid"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
        if ps -p "$FRONTEND_PID" > /dev/null 2>&1; then
            kill "$FRONTEND_PID" 2>/dev/null
            echo "Frontend stopped (PID: $FRONTEND_PID)"
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    echo "All services stopped."
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Check Node.js version
check_node_version() {
    if ! command -v node &> /dev/null; then
        echo "Error: Node.js is not installed"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
    NODE_MINOR=$(echo "$NODE_VERSION" | cut -d'.' -f2)
    
    # Vite 7.x requires Node.js 20.19+ or 22.12+
    # Vite 5.x supports Node.js 18+
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo "Error: Node.js version $NODE_VERSION is too old"
        echo "Please upgrade to Node.js 18.x or higher"
        echo "You can use nvm to manage Node.js versions: https://github.com/nvm-sh/nvm"
        exit 1
    fi
    
    if [ "$NODE_MAJOR" -lt 20 ] || ([ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 19 ]); then
        if [ "$NODE_MAJOR" -eq 18 ]; then
            echo "Warning: Node.js version $NODE_VERSION detected"
            echo "Vite 7.x requires Node.js 20.19+ or 22.12+"
            echo "Consider upgrading Node.js or downgrading Vite to 5.x"
            echo ""
            echo "To upgrade Node.js:"
            echo "  - Using nvm: nvm install 20 && nvm use 20"
            echo "  - Or visit: https://nodejs.org/"
            echo ""
            echo "Continuing anyway (may fail)..."
            echo ""
        fi
    fi
}

# Check Node.js version before starting
check_node_version

# Start frontend
echo "Starting frontend server..."
cd "$FRONTEND_DIR" || {
    echo "Error: Could not change to frontend directory: $FRONTEND_DIR"
    exit 1
}

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install || {
        echo "Error: Failed to install dependencies"
        exit 1
    }
fi

# Start frontend in background
npm run dev > "$SCRIPT_DIR/.frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$FRONTEND_PID_FILE"
echo "Frontend started (PID: $FRONTEND_PID) - http://localhost:3000"

echo ""
echo "=========================================="
echo "  AppLocker Policy Creator is running!"
echo "=========================================="
echo "  Frontend: http://localhost:3000"
echo ""
echo "  Logs:"
echo "    Frontend: $SCRIPT_DIR/.frontend.log"
echo ""
echo "  Press Ctrl+C to stop"
echo "=========================================="
echo ""

# Wait for process
wait

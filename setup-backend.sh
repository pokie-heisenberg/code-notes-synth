#!/bin/bash

# C++ Backend Setup Script for WSL Ubuntu

echo "=== C++ Backend Setup for WSL Ubuntu ==="
echo ""

# Check if CMake is installed
if ! command -v cmake &> /dev/null; then
    echo "CMake not found. Installing..."
    sudo apt update
    sudo apt install -y build-essential cmake git
else
    echo "✓ CMake is installed"
fi

# Check if we're in the right directory
if [ ! -f "main.cpp" ]; then
    echo "Error: main.cpp not found. Please run this script from the code-notes-synth directory"
    exit 1
fi

# Create build directory
echo ""
echo "Creating build directory..."
mkdir -p build
cd build

# Configure and build
echo ""
echo "Configuring project (this will download dependencies)..."
cmake ..

echo ""
echo "Building project..."
cmake --build .

echo ""
echo "=== Build Complete! ==="
echo ""
echo "To run the backend server:"
echo "  cd build"
echo "  ./code-notes-synth-backend"
echo ""
echo "The server will start on http://localhost:8080"


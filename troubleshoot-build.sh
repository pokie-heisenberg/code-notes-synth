#!/bin/bash

# Troubleshoot build issues

echo "=== Checking Build Status ==="
echo ""

cd build

echo "Checking for executable..."
if [ -f "code-notes-synth-backend" ]; then
    echo "✓ Found executable!"
    ls -lh code-notes-synth-backend
elif [ -f "code-notes-synth-backend.exe" ]; then
    echo "✓ Found executable (Windows version)!"
    ls -lh code-notes-synth-backend.exe
else
    echo "✗ Executable not found"
    echo ""
    echo "Checking CMakeCache..."
    if [ -f "CMakeCache.txt" ]; then
        echo "✓ CMakeCache.txt exists"
    else
        echo "✗ CMakeCache.txt not found - need to run cmake .."
        exit 1
    fi
    
    echo ""
    echo "Attempting to rebuild..."
    cmake --build . 2>&1 | tail -20
fi


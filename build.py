#!/usr/bin/env python3
"""
build.py - Production build runner for Dorcas Moïra Portfolio
Calls tools/build.js using Node.js
"""

import subprocess
import sys

def main():
    print("Running production build via tools/build.js...")
    result = subprocess.run(["node", "tools/build.js"], check=False)
    sys.exit(result.returncode)

if __name__ == "__main__":
    main()

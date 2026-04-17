@echo off
title Si Nonna's - Full Stack Startup
color 0A

echo.
echo  ============================================
echo   Si Nonna's - Full Stack MERN Application
echo  ============================================
echo.

:: Check if MongoDB is running
echo [1/4] Checking MongoDB...
mongod --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  [!] mongod not found in PATH.
    echo  [!] Make sure MongoDB is installed and running.
    echo  [!] Download: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

:: Check if mongod is already running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I "mongod.exe" >nul
if %ERRORLEVEL% neq 0 (
    echo  [*] Starting MongoDB...
    start "MongoDB" /min cmd /c "mongod --dbpath C:\data\db 2>nul || mongod 2>nul"
    timeout /t 3 /nobreak >nul
    echo  [OK] MongoDB started.
) else (
    echo  [OK] MongoDB is already running.
)
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo [2/4] Installing root dependencies...
    call npm install
    echo.
)
if not exist "server\node_modules" (
    echo [2/4] Installing server dependencies...
    cd server
    call npm install
    cd ..
    echo.
)
if not exist "client\node_modules" (
    echo [2/4] Installing client dependencies...
    cd client
    call npm install
    cd ..
    echo.
)
echo  [OK] All dependencies installed.
echo.

:: Seed database (optional - only if first run)
echo [3/4] Database seed check...
echo  [*] To seed/re-seed the database, run: npm run seed
echo.

:: Start both servers
echo [4/4] Starting servers...
echo.
echo  Backend:  http://localhost:5000/api
echo  Frontend: http://localhost:5173
echo  Kitchen:  http://localhost:5173/kitchen
echo  Manager:  http://localhost:5173/manager
echo.
echo  Test Logins:
echo    Customer: customer@test.com / test123
echo    Kitchen:  kitchen@test.com  / test123
echo    Manager:  manager@test.com  / test123
echo.
echo  ============================================
echo   Press Ctrl+C to stop all servers
echo  ============================================
echo.

:: Run both servers concurrently
call npm run dev

pause
echo  [OK] All dependencies installed.
echo.

:: Seed database (optional - only if first run)
echo [3/4] Database seed check...
echo  [*] To seed/re-seed the database, run: npm run seed
echo.

:: Start both servers
echo [4/4] Starting servers...
echo.
echo  Backend:  http://localhost:5000/api
echo  Frontend: http://localhost:5173
echo  Kitchen:  http://localhost:5173/kitchen
echo  Manager:  http://localhost:5173/manager
echo.
echo  Test Logins:
echo    Customer: customer@test.com / test123
echo    Kitchen:  kitchen@test.com  / test123
echo    Manager:  manager@test.com  / test123
echo.
echo  ============================================
echo   Press Ctrl+C to stop all servers
echo  ============================================
echo.

:: Run both servers concurrently
call npm run dev

pause

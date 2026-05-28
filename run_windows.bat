@echo off
echo Starting Health AI Sentinel...

echo 1. Starting AI Engine (Python)...
cd ai-engine
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing AI requirements...
pip install -r requirements.txt
start "AI Engine" cmd /c "uvicorn main:app --host 0.0.0.0 --port 8000"
cd ..

echo 2. Starting API Gateway (Node.js)...
cd backend
echo Installing Node requirements...
call npm install
set USE_MOCK_DB=true
set PORT=3000
start "API Gateway" cmd /k "npm run dev"
cd ..

echo 3. Starting Frontend (React Vite)...
cd frontend
echo Installing React requirements...
start "React Frontend" cmd /k "npm run dev"
cd ..

echo All services launched! You can close this window now.
echo The frontend should be running at http://localhost:5173
pause

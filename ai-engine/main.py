from fastapi import FastAPI, File, UploadFile, HTTPException
import shutil
import os
from modules.hemascan import analyze_eye_image
from modules.audiotriage import analyze_cough_audio
from modules.dermoscan import analyze_skin_lesion
from modules.emotionscan import analyze_emotion

app = FastAPI(title="VitaScan AI Engine")

@app.get("/")
def read_root():
    return {"status": "AI Engine is running"}

@app.post("/analyze/eye")
async def analyze_eye(image: UploadFile = File(...)):
    if not image.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Save the file temporarily
    temp_file = f"temp_{image.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    try:
        # Run heuristic OpenCV analysis
        result = analyze_eye_image(temp_file)
    except Exception as e:
        os.remove(temp_file)
        raise HTTPException(status_code=500, detail=str(e))
    
    # Clean up
    os.remove(temp_file)
    return result

@app.post("/analyze/audio")
async def analyze_audio(audio: UploadFile = File(...)):
    if not audio.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    temp_file = f"temp_{audio.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)
        
    try:
        # Run heuristic Librosa analysis
        result = analyze_cough_audio(temp_file)
    except Exception as e:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        raise HTTPException(status_code=500, detail=str(e))
    
    if os.path.exists(temp_file):
        os.remove(temp_file)
    return result

@app.post("/analyze/dermo")
async def analyze_dermo(image: UploadFile = File(...)):
    if not image.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    temp_file = f"temp_dermo_{image.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    try:
        result = analyze_skin_lesion(temp_file)
    except Exception as e:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        raise HTTPException(status_code=500, detail=str(e))
    
    if os.path.exists(temp_file):
        os.remove(temp_file)
    return result

@app.post("/analyze/emotion")
async def analyze_emotion_endpoint(image: UploadFile = File(...)):
    if not image.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    temp_file = f"temp_emo_{image.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    try:
        result = analyze_emotion(temp_file)
    except Exception as e:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        raise HTTPException(status_code=500, detail=str(e))
    
    if os.path.exists(temp_file):
        os.remove(temp_file)
    return result

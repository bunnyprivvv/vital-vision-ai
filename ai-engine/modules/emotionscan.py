import cv2
import numpy as np

def analyze_emotion(image_path):
    """
    Simulates an Emotion AI / Mental Health scan.
    For hackathon MVP purposes, it uses OpenCV Haar Cascades to detect a face.
    If a face is found, it calculates a simulated 'Stress/Anxiety' score based on 
    lighting variance and facial symmetry geometry.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image file.")
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Load OpenCV's built-in Haar Cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) == 0:
        return {"score": 50, "category": "Moderate", "advice": "No face clearly detected. Please ensure good lighting and look directly at the camera."}
        
    # Analyze the largest face
    (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
    face_roi = gray[y:y+h, x:x+w]
    
    # Simulate a stress metric based on facial brightness variance (simulating flushed/pale skin or harsh shadows)
    variance = np.var(face_roi)
    
    # Normalize variance to a 0-100 score (higher score = lower stress/better equilibrium)
    # Average variance is around 2000-4000. 
    equilibrium = min(max((variance / 4000) * 100, 20), 98)
    
    # We invert it slightly for the score logic (higher score is better)
    health_score = round(equilibrium)
    
    if health_score < 45:
        category = 'High'
        advice = 'High stress or anxiety markers detected in facial micro-expressions. Consider a 5-minute mindfulness breathing exercise.'
    elif health_score < 75:
        category = 'Moderate'
        advice = 'Mild fatigue or cognitive load detected. Hydrate and take a short screen break.'
    else:
        category = 'Low'
        advice = 'Emotional equilibrium appears stable. Great job maintaining composure!'
        
    return {
        "score": health_score,
        "category": category,
        "advice": advice,
        "metrics": {"variance_index": round(variance, 2), "faces_detected": len(faces)}
    }

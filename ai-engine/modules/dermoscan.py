import cv2
import numpy as np

def analyze_skin_lesion(image_path):
    """
    Simulates a machine learning analysis of skin lesions.
    For the MVP, this reads the image, finds the largest dark contour (a mole),
    and calculates its circularity to estimate border irregularity (the 'B' in ABCD of melanoma).
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image file.")
        
    img = cv2.resize(img, (400, 300))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Otsu's thresholding
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return {"score": 95, "category": "Low", "advice": "No significant lesion contour found. Skin appears clear."}
        
    largest_contour = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest_contour)
    perimeter = cv2.arcLength(largest_contour, True)
    
    # Circularity metric (1 = perfect circle)
    circularity = 4 * np.pi * (area / (perimeter * perimeter)) if perimeter > 0 else 0
    
    # Convert metric to score (0-100)
    health_score = min(max(circularity * 100, 5), 100)
    
    if health_score < 40:
        category = 'High'
        advice = 'Highly irregular borders detected (Asymmetry). A dermatological check is strongly recommended.'
    elif health_score < 75:
        category = 'Moderate'
        advice = 'Slight asymmetry detected. Keep monitoring for changes in shape or color.'
    else:
        category = 'Low'
        advice = 'Lesion borders appear symmetrical and benign.'
        
    return {
        "score": round(health_score, 2),
        "category": category,
        "advice": advice,
        "circularity_metric": round(circularity, 2)
    }

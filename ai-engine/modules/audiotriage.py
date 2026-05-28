import librosa
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import os

print("Fetching Pre-Trained YAMNet from tfhub.dev...")
yamnet_model_handle = 'https://tfhub.dev/google/yamnet/1'
# Suppress TF Hub warnings momentarily
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
try:
    yamnet_model = hub.load(yamnet_model_handle)
    print("YAMNet Audio Classifier loaded successfully.")
except Exception as e:
    print("Warning: Failed to load YAMNet:", e)

def analyze_cough_audio(audio_path):
    """
    Analyzes an audio file using YAMNet to detect coughing and clear throat classification logits.
    """
    # YAMNet explicitly requires 16kHz mono sampling
    y, sr = librosa.load(audio_path, sr=16000, mono=True)
    
    # Normalize between -1.0 and 1.0
    waveform = y / np.max(np.abs(y)) if np.max(np.abs(y)) > 0 else y
    
    # Run Deep Learning Inference
    scores, embeddings, spectrogram = yamnet_model(waveform)
    
    # The output 'scores' is an array of shape (N frames, 521 classes). We take the mean across frames.
    mean_scores = np.mean(scores.numpy(), axis=0)
    
    # AudioSet ontology indexes: 42 = Cough, 43 = Clearing throat, 0 = Speech
    cough_confidence = mean_scores[42] + mean_scores[43]
    speech_confidence = mean_scores[0]
    
    if cough_confidence > 0.4:
        health_score = 40
        cat = 'High'
        adv = f'YAMNet classification confirmed heavy coughing (Conf: {cough_confidence:.2f}). High respiratory distress risk.'
    elif cough_confidence > 0.1:
        health_score = 65
        cat = 'Moderate'
        adv = f'YAMNet detected minor throat clearing. Monitor for further symptoms.'
    else:
        if speech_confidence > 0.2:
            health_score = 85
            cat = 'Low'
            adv = 'YAMNet primarily detected normal speech patterns instead of distress coughing.'
        else:
            health_score = 95
            cat = 'Low'
            adv = 'No significant respiratory distress classes detected via YAMNet.'
            
    return {
        "score": health_score,
        "category": cat,
        "advice": adv,
        "deep_learning": True,
        "yamnet_stats": {
            "cough_logit": float(cough_confidence),
            "speech_logit": float(speech_confidence)
        }
    }

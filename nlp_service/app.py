from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)

# Load the mBERT model and tokenizer
MODEL_NAME = "bert-base-multilingual-cased"
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    # Assuming this is a sequence classification task with a number of labels
    # equal to the labels provided: True, False, Misleading, Unverified (i.e. 4 labels)
    # If you have a pre-fine-tuned model, ensure num_labels matches its configuration.
    # If you are fine-tuning, this setup is for loading a base model for further fine-tuning.
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=4) 
    model.eval() # Set the model to evaluation mode
except Exception as e:
    print(f"Error loading model or tokenizer: {e}")
    # Fallback or error handling if model loading fails
    tokenizer = None
    model = None

# Classification labels
CLASSIFICATION_LABELS = ["True", "False", "Misleading", "Unverified"]

@app.route('/classify_claim', methods=['POST'])
def classify_claim():
    if not model or not tokenizer:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 500

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    claim_text = data['text']

    try:
        inputs = tokenizer(claim_text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
            confidence, predicted_class_id_tensor = torch.max(probabilities, dim=1)
            
            predicted_class_id = predicted_class_id_tensor.item()
            
            if predicted_class_id < len(CLASSIFICATION_LABELS):
                classification_result = CLASSIFICATION_LABELS[predicted_class_id]
            else:
                # Handle case where predicted_class_id is out of bounds
                classification_result = "Error: Invalid class id"
                
            confidence_score = confidence.item()

        return jsonify({
            "claim": claim_text,
            "classification": classification_result,
            "confidence": confidence_score
        })
    except Exception as e:
        print(f"Error during classification: {e}")
        return jsonify({"error": "Error during classification process."}), 500

if __name__ == '__main__':
    # Make sure to handle model loading before starting the app
    if model and tokenizer:
        app.run(debug=True, port=5001)
    else:
        print("Failed to load model and tokenizer. Application will not start.") 
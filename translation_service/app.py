from flask import Flask, request, jsonify
import requests # For making HTTP requests to the Translation API
import os

app = Flask(__name__)

# It's a good practice to load API keys from environment variables
# Replace 'YOUR_TRANSLATION_API_KEY' with the actual environment variable name
TRANSLATION_API_KEY = os.environ.get('YOUR_TRANSLATION_API_KEY') 
# Replace with the actual base URL for your chosen Translation API
TRANSLATION_API_URL = "YOUR_TRANSLATION_API_ENDPOINT_HERE" 

@app.route('/translate', methods=['POST'])
def translate_text():
    if not TRANSLATION_API_KEY:
        return jsonify({"error": "Translation API Key not configured."}), 500
    
    if TRANSLATION_API_URL == "YOUR_TRANSLATION_API_ENDPOINT_HERE": # Corrected conditional
        return jsonify({"error": "Translation API URL not configured."}), 500

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON request body"}), 400

    text_to_translate = data.get('text')
    target_language = data.get('target_language')
    source_language = data.get('source_language') # Optional, some APIs can auto-detect

    if not text_to_translate or not target_language:
        return jsonify({"error": "Missing 'text' or 'target_language' in request body"}), 400

    # This is a generic placeholder. Actual payload and headers will vary by Translation API.
    payload = {
        'key': TRANSLATION_API_KEY, # This might be a header for some APIs
        'q': text_to_translate,
        'target': target_language,
    }
    if source_language:
        payload['source'] = source_language
    
    headers = {
        # 'Authorization': f'Bearer {TRANSLATION_API_KEY}' # Example if API key is a bearer token
        # 'Ocp-Apim-Subscription-Key': TRANSLATION_API_KEY # Example for Azure Translator
    }

    try:
        # Adjust requests.post or requests.get based on the API
        # Also adjust how parameters are sent (json, params, data)
        response = requests.post(TRANSLATION_API_URL, params=payload, headers=headers) # or json=payload
        response.raise_for_status()
        
        translated_data = response.json()
        
        # Extract the translated text from the response. This is highly dependent on the API's response structure.
        # Example: translated_text = translated_data.get('data', {}).get('translations', [{}])[0].get('translatedText')
        # For now, returning the full response.
        
        # A more robust implementation would parse translated_data to extract the actual translated text.
        # For example:
        # translated_text = translated_data.get('translations', [{}])[0].get('text', "Translation not found")

        return jsonify(translated_data)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error calling Translation API: {str(e)}"}), 503
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    if not TRANSLATION_API_KEY or TRANSLATION_API_URL == "YOUR_TRANSLATION_API_ENDPOINT_HERE":
        print("Warning: Translation API Key or URL is not set. The service may not function correctly.")
    app.run(debug=True, port=5003) # Running on port 5003 
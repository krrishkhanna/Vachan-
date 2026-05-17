from flask import Flask, request, jsonify
import requests # For making HTTP requests to the Google API
import os

app = Flask(__name__)

# It's a good practice to load API keys from environment variables
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY') 
# The base URL for the Google Fact Check API
FACT_CHECK_API_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

@app.route('/check_claim', methods=['GET'])
def check_claim():
    if not GOOGLE_API_KEY:
        return jsonify({"error": "Google API Key not configured. Please set the GOOGLE_API_KEY environment variable."}), 500

    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing 'query' parameter"}), 400

    language_code = request.args.get('languageCode', 'en') # Default to English if not specified

    params = {
        'query': query,
        'languageCode': language_code,
        'key': GOOGLE_API_KEY
        # You can add other parameters like 'pageSize', 'pageToken', etc.
        # 'pageSize': 10 
    }

    try:
        response = requests.get(FACT_CHECK_API_URL, params=params)
        response.raise_for_status() # Raises an HTTPError for bad responses (4XX or 5XX)
        
        data = response.json()
        
        # Process and return the relevant parts of the response
        # The actual structure of 'data' will depend on the Google Fact Check API's response
        # For example, you might want to extract claim reviews:
        # claim_reviews = data.get('claims', []) 
        # return jsonify({"query": query, "results": claim_reviews})

        return jsonify(data) # Returning the full response for now

    except requests.exceptions.RequestException as e:
        # Handle network errors, timeouts, etc.
        return jsonify({"error": f"Error calling Google Fact Check API: {str(e)}"}), 503
    except Exception as e:
        # Handle other potential errors (e.g., JSON decoding errors)
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Ensure the API key is available before starting
    if not GOOGLE_API_KEY:
        print("Warning: GOOGLE_API_KEY environment variable is not set. The service will not be able to contact the Google Fact Check API.")
    app.run(debug=True, port=5002) # Running on a different port 
# backend/src/db/firebase_admin_client.py
import firebase_admin
from firebase_admin import credentials, firestore # Ensure firestore is imported
import os
import json # NEW: Import json for parsing JSON string

# Import settings to get the local fallback path
import backend.config.settings as settings # CHANGED: Use src.config.settings

try:
    if not firebase_admin._apps:
        # Option 1: Load JSON content directly from an environment variable (for AWS deployment)
        firebase_json_content = os.getenv("FIREBASE_ADMIN_SDK_JSON")
        if firebase_json_content:
            # Load credentials directly from the JSON string
            cred = credentials.Certificate(json.loads(firebase_json_content))
            print("DEBUG_FIREBASE_INIT: Firebase Admin SDK initialized from JSON environment variable.")
        else:
            # Option 2: Fallback to local file path (for local development)
            # This path is defined in settings.py
            cred = credentials.Certificate(settings.FIREBASE_ADMIN_CREDENTIALS_PATH)
            print("DEBUG_FIREBASE_INIT: Firebase Admin SDK initialized from local file path.")

        firebase_admin.initialize_app(cred)
        print("DEBUG_FIREBASE_INIT: Firebase Admin SDK app initialized successfully.")
    else:
        print("DEBUG_FIREBASE_INIT: Firebase Admin SDK already initialized.")
except Exception as e:
    print(f"ERROR_FIREBASE_INIT: Error initializing Firebase Admin SDK: {e}")
    # Critical error, usually means wrong credentials or path
    raise # Re-raise the exception to make the app crash during startup if this fails

# Get a Firestore client instance
# Even if messages are in SQL, Firestore might be used for other Firebase features later.
# This part assumes firebase_admin.initialize_app() has already been called successfully.
db = None # Initialize to None
try: 
    db = firestore.client() # Get the Firestore client
    print("DEBUG_FIRESTORE_CLIENT: Firestore client initialized successfully.")
except ValueError as e:
    # This typically means initialize_app() wasn't called or failed
    print(f"ERROR_FIRESTORE_CLIENT: Error initializing Firestore client: {e}. Ensure Firebase Admin SDK is initialized.")
    db = None
except Exception as e:
    print(f"ERROR_FIRESTORE_CLIENT: An unexpected error occurred during Firestore client initialization: {e}")
    db = None

# Dependency to get the Firestore client for FastAPI routes
def get_firestore_db():
    if db is None:
        raise Exception("Firestore client is not initialized. Cannot connect to database.")
    return db
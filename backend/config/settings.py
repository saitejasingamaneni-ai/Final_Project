# backend/config/settings.py
import os
from dotenv import load_dotenv

# Load environment variables (for local dev)
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_file_path = os.path.join(current_dir, '..', '.env')
load_dotenv(dotenv_path=dotenv_file_path)

# --- Firebase Admin SDK Settings ---
# For local dev, this path is used.
# For AWS Beanstalk, we will set FIREBASE_ADMIN_SDK_JSON env var directly in Console.
FIREBASE_ADMIN_CREDENTIALS_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'config',
    'firebase-admin-sdk-key.json'
)

# --- Gemini API Key ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# --- Database Settings ---
SQL_DATABASE_URL = os.getenv("SQL_DATABASE_URL", "postgresql+psycopg2://user:password@host:port/dbname_default")

# --- Other Settings ---
APP_NAME = "Chat Summarizer Backend"
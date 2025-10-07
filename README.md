**Chat Summarizer Application — Backend**

This repository contains the backend API for the Chat Summarizer Application. It provides user authentication, chat management, real-time messaging, and intelligent chat summarization using Large Language Models (LLMs).

**Features
**

**i)User Authentication & Profiles**

User signup and login via Firebase Authentication.

User profiles stored in PostgreSQL, linked by Firebase UID.

**ii)Chat Management
**
Create chats with unique IDs, names, and optional scheduling.

Define chat status (active, scheduled, etc.) at creation.

Add or remove participants (creator-only access).

Retrieve all chats where a user is a participant.

Real-time Messaging

Send and receive messages in real time using Google Firestore.

**iii)LLM-Powered Summarization
**
Generate concise summaries of recent chat messages using Google Gemini via LangChain/LangGraph.

**Tech Stack**
Component	Technology
Language	Python 3.10+
Framework	FastAPI
Database	PostgreSQL + SQLAlchemy ORM
Authentication	Firebase Authentication
Real-time DB	Google Firestore
LLM Integration	Google Gemini API (LangChain / LangGraph)
Environment Management	python-dotenv
Setup Guide
Prerequisites

Python 3.10+

pip

Git

PostgreSQL (running locally)

Firebase project (with Authentication + Firestore enabled)

Google Gemini API key

2️⃣ Clone the Repository
git clone https://github.com/your-username/chat-summarizer-app.git
cd chat-summarizer-app

3️⃣ Set Up Virtual Environment
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

4️⃣ Install Dependencies
pip install -r requirements.txt

5️⃣ Configure Environment Variables

Create a .env file in backend/:

SQL_DATABASE_URL="postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/chat_summarizer_db"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

6️⃣ Initialize the Database
psql -U postgres
CREATE DATABASE chat_summarizer_db;
\q

# Create SQL tables
cd ..
python -m backend.src.db.sql_client


✅ You should see:
All SQL tables created successfully!

7️⃣ Run the Backend Server
uvicorn backend.src.app.main:app --reload


Server runs on:
👉 http://127.0.0.1:8000

📘 API Documentation

Open Swagger UI at:
http://localhost:8000/docs

🔑 Key Endpoints
🔐 Authentication

POST /auth/signup — Register a new user

POST /auth/login — (Handled by frontend Firebase SDK)

GET /auth/protected-route — Verify token access

Chat Management

POST /chats/ — Create new chat

GET /chats/my — Get user’s chats

POST /chats/{chat_id}/participants — Add participant

DELETE /chats/{chat_id}/participants/{user_uid} — Remove participant

Summarization

GET /chats/{chat_id}/summary/ — Summarize latest chat messages
🧠 Summarization

GET /chats/{chat_id}/summary/ — Summarize latest chat messages

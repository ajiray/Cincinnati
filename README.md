# Cincinnati Hotel AI Chatbot - Documentation

## 1. Architecture and Technologies

### System Overview

The system has 5 main components that work together:

1. **React Frontend** - User chat interface and admin dashboard
2. **Node.js Backend** - API that connects frontend to services
3. **Supabase (PostgreSQL)** - Stores chat sessions and statistics
4. **n8n** - Manages AI workflows and processes PDFs
5. **Pinecone + OpenAI** - Stores hotel information and generates responses

### Technologies Chosen

**Frontend:**
- React with Vite - Fast, modern UI
- Tailwind CSS - Quick styling

**Backend:**
- Node.js + Express - Simple API server
- Supabase (PostgreSQL) - Database for tracking conversations

**AI System:**
- n8n - Visual workflow builder (no code changes needed)
- Pinecone - Vector database for storing PDF content
- OpenAI - text-embedding-3-small for embeddings, GPT-4 for responses


## 2. How the System Processes Information

### PDF Upload and Processing (Admin)

**Step-by-step flow:**

1. **Admin uploads PDF** in the dashboard
2. **Frontend sends PDF** to backend API (`/api/upload/pdf`)
3. **Backend forwards** PDF to n8n webhook
4. **n8n workflow processes the PDF:**
   - Deletes all old vectors from Pinecone (clears previous knowledge)
   - Extracts text content from PDF
   - Splits text into smaller chunks (512 tokens each)
   - Sends chunks to OpenAI to create embeddings (vector representations)
   - Stores vectors in Pinecone database
5. **Returns success** to admin
6. **Chatbot is now ready** with updated hotel information

**Result:** New PDF completely replaces old hotel information. Chatbot uses only the latest uploaded content.

---

### Chat Workflow (User)

**Step-by-step flow:**

1. **User types question** in chat interface
2. **Frontend sends message** to backend API (`/api/chat`) with:
   - The question
   - Session ID (to remember conversation)
3. **Backend forwards** to n8n webhook
4. **n8n workflow processes the question:**
   - Creates or updates chat session in Supabase
   - Sends question to OpenAI to create embedding
   - Searches Pinecone for similar hotel information (top 4 matches)
   - AI Agent reads the retrieved information
   - Generates response using only the PDF content
   - Categorizes the question (Rooms, Restaurant, Facilities, Prices, Services, Other)
   - Saves message and category to Supabase
5. **Returns AI response** to backend
6. **Backend sends** to frontend
7. **User sees answer** in chat

**Key Features:**
- **Memory:** AI remembers previous messages in the same session
- **Grounded responses:** AI only uses information from the PDF, never makes up answers
- **Smart categorization:** Every question is automatically categorized for statistics

**When AI can't answer:**
- Shows: "I'm sorry, I don't have that information right now..."
- Offers contact form with Yes/No buttons
- User can submit name, phone, email (UI only, not saved yet)


## 3. Admin Dashboard Design and Data Flow

### Dashboard Features

The admin dashboard has two main sections:

**1. PDF Upload Section (Left Side)**
- Drag-and-drop area to upload hotel information PDF
- Shows current uploaded file name and size
- Visual feedback during upload
- Replaces previous knowledge base when new PDF is uploaded

**2. Statistics Section (Right Side)**
- **Total Chat Sessions** - Number of unique conversations
- **Total Questions** - Total questions asked by all users
- **Questions by Category** - Breakdown with color-coded progress bars:
  - Rooms (purple)
  - Restaurant (pink)
  - Facilities (amber)
  - Prices (blue)
  - Services (green)
  - Other (gray)

### Design Principles

- **Clean and modern** - Gradient backgrounds, glassmorphism effects
- **Color-coded categories** - Easy to distinguish question types
- **Real-time updates** - Statistics refresh automatically every 5 seconds
- **Responsive layout** - Works on desktop, tablet, and mobile

### Data Flow

**How statistics are collected and displayed:**

1. **User chats** → Questions are saved to Supabase with categories
2. **Admin opens dashboard** → React component loads
3. **Frontend calls** `/api/stats` endpoint
4. **Backend queries Supabase:**
```sql
   - Count distinct sessions
   - Count total messages
   - Group messages by category and count each
```
5. **Backend returns data** in JSON format
6. **Frontend displays** statistics with charts and numbers
7. **Auto-refresh** - Repeats steps 3-6 every 5 seconds

**Database Tables Used:**

- `chat_sessions` - Stores unique conversation sessions
- `chat_messages` - Stores every question with category

**Result:** Admin sees live statistics showing how guests use the chatbot and what topics they ask about most.


## 4. Setup and Running Instructions

### Prerequisites

Install these first:
- Node.js 18+ ([download](https://nodejs.org/))
- n8n: `npm install -g n8n`

Create accounts (free tiers):
- [Supabase](https://supabase.com)
- [Pinecone](https://www.pinecone.io/)
- [OpenAI](https://platform.openai.com/)

---

### Step 1: Setup Database (Supabase)

1. Go to Supabase dashboard → SQL Editor
2. Run this SQL:
```sql
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id)
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_category ON chat_messages(category);
```

3. Get your connection string: Settings → Database → Connection String (URI)

---

### Step 2: Setup Pinecone

1. Create new index:
   - Name: `cincinnati-hotel`
   - Dimensions: `512`
   - Metric: `cosine`
2. Copy your API key and index host URL

---

### Step 3: Setup Backend
```bash
cd cincinnati-hotel-backend
npm install
```

Create `.env` file:
```env
PORT=5050
DATABASE_URL=your_supabase_connection_string_here
N8N_WEBHOOK_URL=http://localhost:5678
```

---

### Step 4: Setup Frontend
```bash
cd cincinnati-hotel-frontend
npm install
```

---

### Step 5: Setup n8n Workflows

1. Start n8n:
```bash
n8n start
```

2. Open `http://localhost:5678`

3. Create credentials:
   - OpenAI API Key
   - Pinecone API Key
   - Supabase Host + API Key

4. Import two workflows:
   - **PDF Upload Workflow**: Receives PDF, processes, stores in Pinecone
   - **Chat Workflow**: Handles user questions, queries Pinecone, returns AI responses

5. Activate both workflows

---

### Running the Application

**Terminal 1 - Backend:**
```bash
cd cincinnati-hotel-backend
npm run dev
```
Runs on: `http://localhost:5050`

**Terminal 2 - Frontend:**
```bash
cd cincinnati-hotel-frontend
npm run dev
```
Runs on: `http://localhost:5173`

**Terminal 3 - n8n:**
```bash
n8n start
```
Runs on: `http://localhost:5678`

**Access the app:** Open browser to `http://localhost:5173`

---

### Testing

**Test Chat:**
1. Click "Chat with AI"
2. Ask: "What types of rooms do you have?"
3. Verify AI responds

**Test Admin:**
1. Click "Admin Dashboard"
2. Upload a hotel PDF
3. Go back to chat and ask questions
4. Return to admin - see statistics updated

**Test Contact Form:**
1. Ask: "Can you arrange a helicopter tour?"
2. AI should say "I don't have that information"
3. Click "Yes, please" and fill the form

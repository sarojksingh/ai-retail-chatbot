# AI Retail Chatbot(As service) to Node and React application

A conversational sales chatbot for retail/e-commerce that holds open-ended conversations, asks clarifying questions, and recommends products contextually using AI-powered RAG (Retrieval-Augmented Generation).

## 🎯 Project Overview

This project aims to build a scalable, customizable chatbot core that can be deployed for multiple retail client companies. The chatbot leverages:

- **LLM Integration**: OpenAI GPT API for natural language understanding and generation
- **RAG Technology**: Retrieval-Augmented Generation for real-time product catalog access
- **Backend**: Python FastAPI for robust API development
- **Database**: PostgreSQL/MySQL for persistent storage
- **Conversation Management**: Context-aware dialogue with conversation history

## 📋 Features

### MVP (Current Phase)

- [ ] Basic conversation engine with OpenAI integration
- [ ] Product catalog ingestion (CSV format)
- [ ] RAG implementation with product embeddings
- [ ] User authentication & session management
- [ ] Conversation history persistence
- [ ] Basic product recommendation engine
- [ ] REST API endpoints for chatbot interactions
- [ ] Simple web UI for testing

### Future Enhancements

- [ ] Multi-channel integration (Shopify, WooCommerce)
- [ ] Advanced upsell/cross-sell strategies
- [ ] Analytics & conversion optimization
- [ ] Chat widget for websites
- [ ] Fine-tuning capabilities
- [ ] Multi-language support
- [ ] Advanced conversation flows

## 🛠️ Tech Stack

- **Backend**: Python 3.9+
- **Framework**: FastAPI
- **LLM**: OpenAI API (GPT-3.5/GPT-4)
- **RAG**: LangChain + FAISS
- **Database**: PostgreSQL / MySQL
- **ORM**: Prisma
- **API Server**: Uvicorn

## 📁 Project Structure

```
ai-retail-chatbot/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── models/
│   │   ├── __init__.py
│   │   ├── conversation.py     # Conversation model
│   │   ├── product.py          # Product model
│   │   └── user.py             # User model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── chat.py             # Chat endpoints
│   │   ├── products.py         # Product endpoints
│   │   └── health.py           # Health check endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── chatbot_engine.py   # Main chatbot logic
│   │   ├── llm_service.py      # LLM API interactions
│   │   ├── rag_service.py      # RAG implementation
│   │   ├── product_service.py  # Product management
│   │   └── embedding_service.py # Embedding generation
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── database.py         # Database utilities
│   │   ├── prompt_templates.py # LLM prompts
│   │   └── logger.py           # Logging configuration
│   └── schemas/
│       ├── __init__.py
│       ├── chat.py             # Chat request/response schemas
│       └── product.py          # Product schemas
├── data/
│   ├── products.csv            # Sample product catalog
│   └── embeddings/             # Stored embeddings
├── tests/
│   ├── __init__.py
│   ├── test_chatbot.py
│   ├── test_rag.py
│   └── test_api.py
├── migrations/                 # Database migrations
├── scripts/
│   ├── init_db.py             # Database initialization
│   ├── load_products.py       # Load products from CSV
│   └── generate_embeddings.py # Generate product embeddings
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── docker-compose.yml         # Docker setup (optional)
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL or MySQL
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sarojksingh/ai-retail-chatbot.git
cd ai-retail-chatbot
```

2. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize database:

```bash
python scripts/init_db.py
```

6. Load product catalog:

```bash
python scripts/load_products.py
```

7. Generate embeddings:

```bash
python scripts/generate_embeddings.py
```

8. Run the application:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000/docs` for API documentation.

## 📡 API Endpoints

### Chat Endpoints

- `POST /api/chat` - Send message and get chatbot response
- `GET /api/chat/history/{session_id}` - Get conversation history
- `DELETE /api/chat/session/{session_id}` - Clear conversation

### Product Endpoints

- `GET /api/products` - List products
- `GET /api/products/{product_id}` - Get product details
- `POST /api/products/search` - Search products

### Health Endpoints

- `GET /health` - Health check

## 🗄️ Database Schema

### Key Tables

- **users**: User authentication and profiles
- **conversations**: Conversation sessions
- **messages**: Individual messages in conversations
- **products**: Product catalog
- **product_embeddings**: Vector embeddings for RAG

## 🧠 RAG Implementation

The chatbot uses FAISS for similarity search over product embeddings:

1. Products are converted to embeddings using OpenAI's embedding model
2. User queries are embedded and matched against product catalog
3. Top-K similar products are retrieved and used in LLM context

## 🔐 Environment Configuration

See `.env.example` for all configuration options. Key variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_TYPE`: postgresql or mysql
- `DB_*`: Database connection details
- `CATALOG_SOURCE`: csv, api, or shopify

## 📝 Free LLM Alternatives

If OpenAI API becomes unavailable, consider:

- **Ollama**: Local LLM deployment (free, offline)
- **Hugging Face Inference API**: Free tier available
- **Anthropic Claude**: Freemium model
- **LLaMA 2**: Open-source, can be self-hosted

## 🤝 Contributing

This project is under active development. Contributions are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 📞 Contact

For questions or support, please open an issue on GitHub.

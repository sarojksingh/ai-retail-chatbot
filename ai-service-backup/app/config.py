"""Application configuration"""
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings"""
    # App settings
    APP_NAME: str = "AI Retail Chatbot"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    APP_DEBUG: bool = os.getenv("APP_DEBUG", "True").lower() == "true"
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", "8000"))
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # Database settings
    DATABASE_TYPE: str = os.getenv("DATABASE_TYPE", "postgresql")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "5432"))
    DB_NAME: str = os.getenv("DB_NAME", "retail_chatbot")
    DB_USER: str = os.getenv("DB_USER", "chatbot_user")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    
    # RAG settings
    RAG_CHUNK_SIZE: int = int(os.getenv("RAG_CHUNK_SIZE", "500"))
    RAG_CHUNK_OVERLAP: int = int(os.getenv("RAG_CHUNK_OVERLAP", "50"))
    RAG_SIMILARITY_THRESHOLD: float = float(os.getenv("RAG_SIMILARITY_THRESHOLD", "0.7"))
    RAG_TOP_K: int = 5
    
    # Conversation settings
    MAX_CONVERSATION_HISTORY: int = int(os.getenv("MAX_CONVERSATION_HISTORY", "20"))
    CONVERSATION_MEMORY_TYPE: str = os.getenv("CONVERSATION_MEMORY_TYPE", "buffer")
    
    # Catalog settings
    CATALOG_SOURCE: str = os.getenv("CATALOG_SOURCE", "csv")
    CATALOG_PATH: str = os.getenv("CATALOG_PATH", "data/products.csv")
    
    @property
    def database_url(self) -> str:
        """Build database URL"""
        if self.DATABASE_TYPE == "postgresql":
            return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        elif self.DATABASE_TYPE == "mysql":
            return f"mysql+mysql-connector://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        raise ValueError(f"Unsupported database type: {self.DATABASE_TYPE}")

settings = Settings()
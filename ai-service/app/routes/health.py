"""Health check endpoints"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import settings
import logging

router = APIRouter(prefix="/api", tags=["health"])
logger = logging.getLogger(__name__)

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    environment: str
    version: str

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        environment=settings.APP_ENV,
        version="0.1.0"
    )

@router.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "AI Retail Chatbot API",
        "version": "0.1.0",
        "docs": "/docs"
    }

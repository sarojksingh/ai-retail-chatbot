# Contributing to AI Retail Chatbot

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Install development dependencies: `pip install -r requirements.txt`
4. Create `.env` file from `.env.example`
5. Initialize database: `python scripts/init_db.py`

## Code Style

- Follow PEP 8 guidelines
- Use type hints in Python code
- Write docstrings for all functions and classes
- Run linting: `flake8 app/`

## Testing

- Write unit tests for new features
- Run tests: `pytest tests/`
- Maintain >80% code coverage

## Commit Messages

- Use descriptive commit messages
- Format: `[Type] Description` (e.g., `[Feature] Add chat endpoint`)
- Types: Feature, Fix, Docs, Style, Refactor, Test, Chore

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Submit PR with clear description
5. Link related issues

## Project Roadmap

### Phase 1: MVP (Current)

- Basic conversation engine
- RAG implementation
- Product catalog integration

### Phase 2: Enhancement

- Advanced recommendation logic
- Multi-channel integration
- Analytics

### Phase 3: Scale

- Performance optimization
- Enterprise features
- Multi-tenant support

## Questions?

Open an issue or discussion for questions or suggestions!

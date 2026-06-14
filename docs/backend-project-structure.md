# Backend Project Structure (Monolithic)

## Overview
This document outlines a recommended project structure for implementing the Splitwiser backend as a **monolithic application**. This structure promotes modularity, maintainability, and scalability within a single codebase. This example primarily assumes a Python-based environment (e.g., using FastAPI), but the principles can be adapted.

## Conceptual Root Directory Structure
The backend code will reside within a dedicated root folder, for example, `splitwiser-backend/`.

```
/splitwiser-backend/
|-- /app/                        # Core application code
|   |-- /api/                    # API endpoints and routing
|   |   |-- __init__.py
|   |   |-- v1/                  # API version 1
|   |   |   |-- __init__.py
|   |   |   |-- auth_routes.py     # Authentication related endpoints
|   |   |   |-- user_routes.py     # User profile management endpoints
|   |   |   |-- group_routes.py    # Group management endpoints
|   |   |   |-- expense_routes.py  # Expense, settlement, balance, analytics endpoints
|   |   |   `-- (other common route files or utility routers if any)
|   |-- /core/                   # Core logic (config, security, common dependencies)
|   |   |-- __init__.py
|   |   |-- config.py            # Application configuration settings
|   |   |-- security.py          # Password hashing, JWT utilities, etc.
|   |   `-- dependencies.py      # Common FastAPI dependencies (e.g., GetCurrentUser)
|   |-- /db/                     # Database interaction layer
|   |   |-- __init__.py
|   |   |-- client.py            # Database client setup (e.g., MongoDB)
|   |   |-- base_repo.py         # Optional: Base repository with common CRUD methods
|   |   |-- user_repo.py         # User data access
|   |   |-- group_repo.py        # Group data access
|   |   |-- expense_repo.py      # Expense data access
|   |   `-- settlement_repo.py   # Settlement data access
|   |-- /models/                 # Data models (representing database entities/documents)
|   |   |-- __init__.py
|   |   |-- user.py              # User model
|   |   |-- group.py             # Group model
|   |   |-- expense.py           # Expense model
|   |   `-- settlement.py        # Settlement model
|   |-- /schemas/                # Pydantic schemas for request/response validation and serialization
|   |   |-- __init__.py
|   |   |-- token_schemas.py     # Schemas for tokens (e.g., access token)
|   |   |-- user_schemas.py      # Schemas for user-related data
|   |   |-- group_schemas.py     # Schemas for group-related data
|   |   |-- expense_schemas.py   # Schemas for expense, balance, analytics data
|   |   `-- settlement_schemas.py # Schemas for settlement data
|   |-- /services/               # Business logic layer for different domains
|   |   |-- __init__.py
|   |   |-- auth_service.py      # Handles authentication logic
|   |   |-- user_service.py      # Handles user profile logic
|   |   |-- group_service.py     # Handles group management logic
|   |   |-- expense_service.py   # Handles expense CRUD, settlement, balance, and analytics logic
|   |-- /utils/                  # General utility functions
|   |   |-- __init__.py
|   |   |-- calculations.py      # e.g., complex financial calculations for expenses/settlements
|   |   `-- helpers.py           # Other miscellaneous helper functions
|   |-- __init__.py
|   |-- main.py                  # FastAPI application instance, startup events, middleware
|
|-- /tests/                      # Automated tests (unit, integration)
|   |-- __init__.py
|   |-- /api/                    # Tests for API endpoints
|   |   |-- test_auth_routes.py
|   |   |-- test_user_routes.py
|   |   |-- test_group_routes.py
|   |   `-- test_expense_routes.py
|   |-- /services/               # Tests for business logic in services
|   |   |-- test_auth_service.py
|   |   |-- test_user_service.py
|   |   |-- test_group_service.py
|   |   `-- test_expense_service.py # e.g., test settlement simplification algorithm
|   |-- /utils/                  # Tests for utility functions
|   |   `-- test_calculations.py
|   |-- conftest.py              # Pytest fixtures (e.g., test DB client, sample data)
|   `-- (other specific test modules as needed)
|
|-- Dockerfile                   # To containerize the application
|-- requirements.txt             # Python dependencies for the project
|-- .env.example                 # Example environment variables
|-- README.md                    # Root README for the backend project
|-- .gitignore
```

## Key Directory Explanations

*   `/app/`: Contains all the core application code.
    *   `api/v1/`: Defines the API interface. Route modules are domain-specific (e.g., `auth_routes.py`, `expense_routes.py`).
    *   `core/`: Core application settings (e.g., `config.py`), security utilities (`security.py`), and shared dependencies (`dependencies.py`).
    *   `db/`: Database interaction logic. Includes the DB client setup and repositories (e.g., `user_repo.py`) that abstract database operations.
    *   `models/`: Data models that represent your database entities (e.g., Pydantic models mapping to MongoDB documents).
    *   `schemas/`: Pydantic schemas for data validation and serialization of API requests and responses, organized by domain.
    *   `services/`: The business logic layer. Domain-specific service modules (e.g., `expense_service.py`) orchestrate data access and implement core functionalities.
    *   `utils/`: General utility functions.
    *   `main.py`: The entry point of your application (e.g., where you create your FastAPI instance and include routers).
*   `/tests/`: Contains all automated tests, with subdirectories mirroring the `/app/` structure where appropriate.
*   `Dockerfile`: Used to build a Docker container for the application.
*   `requirements.txt`: Lists the Python package dependencies.
*   `.env.example`: A template for the environment variables.
*   `README.md`: Provides information about the project, how to run it, test it, etc.

This monolithic structure keeps related code for different domains (auth, users, groups, expenses) organized within a single application, simplifying development and deployment for smaller to medium-sized projects while still allowing for a good separation of concerns.

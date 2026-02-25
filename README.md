
CURRENCY CONVERTER | FULL STACK TECHNICAL ASSESSMENT
===========================================================

A production-ready platform built with .NET 8 and React (TypeScript) 
demonstrating Clean Architecture, resilience, and security.

-----------------------------------------------------------
1. QUICK START
-----------------------------------------------------------

BACKEND (.NET 8)
- Location:  /CurrencyConverter.Api
- Command:   dotnet restore && dotnet run
- API URL:   https://localhost:7057
- Testing:   dotnet test --collect:"XPlat Code Coverage"

FRONTEND (React + TS)
- Location:  /currency-converter-ui
- Command:   npm install && npm run dev
- App URL:   http://localhost:5173

-----------------------------------------------------------
2. TECHNICAL ARCHITECTURE
-----------------------------------------------------------

BACKEND (Layered Architecture)
- Patterns:  Provider Factory (Frankfurter API), Dependency Injection
- Resilience: Polly (Exponential Retry & Circuit Breaker)
- Security:  JWT Auth & Role-Based Access (RBAC)
- Performance: 6h In-memory caching & Rate Limiting
- Logging:   Structured Serilog (Client IP + JWT ID tracking)

FRONTEND
- Features:  Context-based Auth, Role-based UI, Historical Pagination

-----------------------------------------------------------
3. SECURITY & TESTING
-----------------------------------------------------------

TEST USERS:
- Admin: admin / admin
- User:  user / user

TESTING STATUS:
- Backend:  90%+ Unit & Integration coverage
- Frontend: Component & core flow validation (Login/Convert)

-----------------------------------------------------------
4. AI COLLABORATION STATEMENT
-----------------------------------------------------------

AI (ChatGPT/Copilot) was utilized as a productivity tool for 
architecture refinement and test scaffolding. All API contracts, 
security thresholds, and business logic were manually architected 
and validated to ensure production standards.

-----------------------------------------------------------
5. FUTURE IMPROVEMENTS
-----------------------------------------------------------
- Redis Distributed Cache
- OpenTelemetry Tracing
- Docker & Kubernetes Orchestration
- CI/CD (GitHub Actions)
===========================================================

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About OWASP Juice Shop

OWASP Juice Shop is an intentionally insecure web application designed for security training, awareness demos, CTFs, and testing security tools. It encompasses vulnerabilities from the OWASP Top Ten and other real-world security flaws.

**IMPORTANT**: This is a deliberately vulnerable application. Code contains intentional security flaws for educational purposes. Do not apply security fixes unless explicitly requested.

## Development Commands

### Setup and Installation
```bash
npm install                    # Install dependencies (also builds frontend and server)
```

### Running the Application
```bash
npm start                      # Start production build (requires npm run build:server first)
npm run serve                  # Development mode: run server and frontend concurrently
npm run serve:dev              # Development with auto-reload (uses ts-node-dev)
```

### Building
```bash
npm run build:frontend         # Build Angular frontend (in frontend/)
npm run build:server           # Compile TypeScript server code to build/
```

### Testing
```bash
npm test                       # Run all tests (frontend + server)
npm run test:server            # Backend unit tests (Mocha)
npm run test:api               # API integration tests (Frisby/Jest)
npm run cypress:open           # Open Cypress for e2e tests
npm run cypress:run            # Run Cypress e2e tests headless
```

### Linting
```bash
npm run lint                   # Lint backend and frontend
npm run lint:fix               # Auto-fix linting issues
npm run lint:config            # Validate config.schema.yml
```

### Other Commands
```bash
npm run rsn                    # Risk management tool
npm run package                # Create distributable packages
```

## Architecture Overview

### Backend (Node.js + Express + TypeScript)

**Entry Points:**
- [app.ts](app.ts) - Application initialization
- [server.ts](server.ts) - Express server setup, middleware configuration, route registration

**Core Directories:**
- [routes/](routes/) - API endpoints (60+ route files, one per feature)
- [models/](models/) - Sequelize ORM models for SQLite database
- [lib/](lib/) - Shared utilities and business logic
  - [lib/insecurity.ts](lib/insecurity.ts) - Intentionally insecure authentication/security helpers
  - [lib/challengeUtils.ts](lib/challengeUtils.ts) - Challenge solving and verification
  - [lib/antiCheat.ts](lib/antiCheat.ts) - Anti-cheating mechanisms
  - [lib/startup/](lib/startup/) - Application initialization modules
- [data/](data/) - Data seeding and static content
  - [data/datacreator.ts](data/datacreator.ts) - Seeds database on startup
  - [data/staticData.ts](data/staticData.ts) - Static application data

**Database:**
- SQLite database at `data/juiceshop.sqlite`
- Models initialized in [models/index.ts](models/index.ts)
- Uses Sequelize ORM with model relationships defined in [models/relations.ts](models/relations.ts)

**Key Backend Patterns:**
- Each route file exports functions that handle specific endpoints
- Routes are registered in [server.ts](server.ts)
- Challenges are tracked in database and solved via `challengeUtils.solve()`
- Configuration managed via `config` package (see [config/](config/) directory)

### Frontend (Angular + TypeScript)

**Location:** [frontend/](frontend/)

**Key Directories:**
- [frontend/src/app/](frontend/src/app/) - Angular components, services, guards
- [frontend/src/assets/](frontend/src/assets/) - Static assets
- [frontend/src/hacking-instructor/](frontend/src/hacking-instructor/) - Tutorial system

**Frontend Commands:**
```bash
cd frontend
npm run start                  # Development server (ng serve)
npm run build                  # Production build
npm test                       # Run Angular/Karma tests
npm run lint                   # Lint TypeScript and SCSS
```

**Frontend Architecture:**
- Angular 19 with Angular Material UI
- Components organized by feature
- Services handle API communication
- Uses RxJS for reactive programming

### Testing Structure

**API Tests:** [test/api/](test/api/)
- Integration tests using Frisby (custom fork) and Jest
- Test API endpoints and business logic
- Run with `npm run test:api`

**Server Tests:** [test/server/](test/server/)
- Unit tests for backend utilities and models
- Uses Mocha and Chai
- Run with `npm run test:server`

**E2E Tests:** [test/cypress/](test/cypress/)
- End-to-end tests for challenges and user flows
- Uses Cypress
- Run with `npm run cypress:run` or `npm run cypress:open`

**Frontend Tests:** [frontend/src/app/](frontend/src/app/)
- Component and service tests using Jasmine/Karma
- Located alongside source files (*.spec.ts)

## Code Style

- **JavaScript Standard Style** - enforced by ESLint
- All backend code must pass `npm run lint`
- All commits must be signed off (`git commit -s`)
- New challenges require corresponding e2e tests
- New/changed code should have unit/integration tests

## Configuration

- Main config schema: [config.schema.yml](config.schema.yml)
- Default config: [config/default.yml](config/default.yml)
- Environment-specific configs in [config/](config/)
- Custom configurations can modify challenges, application theme, CTF settings, etc.

## Node.js Version

Supports Node.js 20-22 (see [package.json](package.json) engines field). The project is tested on the latest minor versions of Node 20 and 22.

## Common Development Workflows

### Adding a New Challenge
1. Add challenge definition in [data/staticData.ts](data/staticData.ts)
2. Implement vulnerability in relevant route or component
3. Add challenge solving logic (call `challengeUtils.solve()`)
4. Create Cypress e2e test in [test/cypress/e2e/](test/cypress/e2e/)
5. Update hints/solutions in companion guide if needed

### Adding a New API Endpoint
1. Create route file in [routes/](routes/)
2. Import and register in [server.ts](server.ts)
3. Add corresponding model if needed in [models/](models/)
4. Write API tests in [test/api/](test/api/)
5. Create frontend service method if needed

### Running Single Test File
```bash
# API test
npx jest test/api/specificTest.ts

# Server test
npx mocha -r ts-node/register test/server/specificTest.ts

# Cypress test
npx cypress run --spec "test/cypress/e2e/specificTest.cy.ts"
```

## Database Management

The SQLite database is recreated on each startup with seed data from [data/datacreator.ts](data/datacreator.ts). To reset the application state, simply restart the server.

## CTF Mode

Juice Shop supports CTF events with flag codes and score tracking. See CTF configuration in [config/ctf.yml](config/ctf.yml) and documentation at https://pwning.owasp-juice.shop/companion-guide/latest/part4/ctf.html

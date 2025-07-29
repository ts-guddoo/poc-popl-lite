# Popl Lite

A stateless Express.js + TypeORM + MySQL service for managing Companies, Contacts, and Activities.

## Prerequisites

- **Node.js**: Version 20.2.0 or higher
- **Docker**: For running MySQL and phpMyAdmin
- **npm**: For package management

## Features

- Companies: CRUD operations
- Contacts: CRUD operations (each belongs to a Company)
- Activities: Create and list by Contact/Company
- Validation for all fields and relationships
- **phpMyAdmin** for database browsing at `http://localhost:12000`

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/ts-guddoo/poc-popl-lite.git
cd poc-popl-lite
npm install
```

### 2. Environment Configuration (Optional)

Create the environment files with the following content (Optional step: Provide if need to override):

**Create `.env`:**

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=popluser
DB_PASSWORD=poplpassword
DB_NAME=popl_lite

# Server Configuration
PORT=3000

# Node Environment
NODE_ENV=development

# TypeORM Configuration (for development)
# Set to false in production
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

### 3. Start MySQL with Docker Compose

```bash
docker-compose up -d
```

This will start:

- **MySQL 8.0** on port 3306
- **phpMyAdmin** on port 12000 (login: `popluser`/`poplpassword`)

### 4. Create Database Schema (Optional)

Once MySQL is running, you can apply the schema manually:

```bash
mysql -h 127.0.0.1 -u popluser -ppoplpassword popl_lite < db.sql
```

_Note: TypeORM will auto-create tables with `synchronize: true`_

### 5. Start the Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

## API Testing with Postman

### Import Postman Collection

1. **Open Postman**
2. **Click "Import"** (top left)
3. **Drag & drop** the `Popl-Lite-API.postman_collection.json` file
4. **Or click "Upload Files"** and select the file

### Testing Flow

1. **Start with Companies:**

   - Create a company first
   - Note the company ID from the response

2. **Then create Contacts:**

   - Use the company ID from step 1
   - Note the contact ID from the response

3. **Finally create Activities:**

   - Use the contact ID from step 2

4. **Test all endpoints:**
   - List companies/contacts
   - Get by ID
   - Update records
   - List activities by contact/company
   - Test error cases

### Environment Variables in Postman

The collection uses `{{baseUrl}}` variable set to `http://localhost:3000`

## API Overview

### Companies

- `POST   /companies` - Create company
- `GET    /companies/:id` - Get company by id
- `PUT    /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company
- `GET    /companies` - List all companies
- `GET    /companies/:companyId/activities` - List activities for a company

### Contacts

- `POST   /contacts` - Create contact (requires `companyId`)
- `GET    /contacts/:id` - Get contact by id
- `PUT    /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact
- `GET    /contacts` - List all contacts
- `GET    /contacts/:contactId/activities` - List activities for a contact

### Activities

- `POST   /activities` - Create activity (requires `contactId`, `timestamp`, `note`)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented)

## Database Browsing

Access **phpMyAdmin** at `http://localhost:12000`:

- **Username:** `popluser`
- **Password:** `poplpassword`
- **Database:** `popl_lite`

Browse tables, execute queries, and manage data through the web interface.

## Development vs Production

### Development Mode

```bash
npm run dev
```

- Hot reload enabled
- TypeORM synchronize: true
- Detailed logging
- Development environment

### Production Mode

```bash
npm run build
npm start
```

- Compiled TypeScript
- TypeORM synchronize: false (recommended)
- Minimal logging
- Production environment

**For production, update your `.env`:**

```bash
NODE_ENV=production
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=false
```

## How it was tested

- Manual testing with Postman collection for all endpoints
- Validation and error cases checked
- Database operations tested via phpMyAdmin

## Known Limitations / Assumptions

- No authentication or authorization
- No pagination on list endpoints
- No soft deletes
- Minimal error details for brevity
- TypeORM `synchronize: true` is used for dev only
- Email validation uses class-validator's `@IsEmail` (not full RFC compliance)

## Project Structure

```
src/
├── models/          # TypeORM entities
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── routes/          # Express route definitions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Environment Variables

See the environment file content above for all available configuration options.

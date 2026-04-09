## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints

### Contact Message
Submit a contact us message from the frontend.

**POST** `/contact-messages`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+15550000000",
  "message": "Your message here (max 5000 characters)"
}
```

**Features:**
- ✅ Input validation (email format, required fields, max lengths)
- ✅ XSS protection (HTML/JS sanitization)
- ✅ Rate limiting (5 requests per hour per IP)
- ✅ Custom error messages

**Response (201 Created):**
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+15550000000",
  "message": "Your message here",
  "createdAt": "2026-04-09T10:32:16.000Z"
}
```

**Rate Limit Error (429):**
```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```


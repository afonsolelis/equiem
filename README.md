# Equiem One Platform Data Model API

This project exposes a simple HTTP API for validating payloads that follow the Equiem One platform data model.

It is not a persistence layer and it does not store records in a database. Instead, it acts as a schema validation service: each endpoint receives a JSON payload for one entity type, validates required fields, primitive types, enums, and some array/date constraints, then returns whether the payload is valid.

## Purpose

The API is organized around the main domains of the Equiem platform model:

- Location hierarchy
- Tenant entities
- Bookings
- Identity and access

This makes the project useful for:

- validating integrations before data is persisted elsewhere
- documenting the expected structure of platform entities
- testing client payloads against a consistent contract
- exploring the model through Swagger UI

## How the Model Is Represented

The data model is defined in code, primarily in:

- [`src/schemas.js`](/home/afonsolelis/repositorios/inteli/equiem/src/schemas.js): canonical field definitions for every entity
- [`src/validator.js`](/home/afonsolelis/repositorios/inteli/equiem/src/validator.js): validation rules applied to request bodies
- [`src/routes/index.js`](/home/afonsolelis/repositorios/inteli/equiem/src/routes/index.js): entity endpoints
- [`src/swagger.js`](/home/afonsolelis/repositorios/inteli/equiem/src/swagger.js): OpenAPI schema and examples

Each entity schema is expressed as a set of fields with metadata such as:

- `type`
- `required`
- `enum`
- `items` for array element typing

## Validation Behavior

The validator currently enforces the following rules:

- Required fields must be present and cannot be `undefined`, `null`, or an empty string.
- Optional fields may be omitted.
- Primitive types are validated as `string`, `number`, `boolean`, `date`, or `array`.
- Enum-constrained string fields must match one of the allowed values.
- Array fields can require all elements to be strings.
- Date fields must be parseable as valid ISO-style date strings.

The validator does not currently enforce:

- foreign key existence across entities
- uniqueness constraints
- minimum or maximum numeric ranges
- string formats such as email, phone, timezone, or UUID syntax
- business rules such as `endTime > startTime`
- rejection of unknown extra fields

That distinction is important: this API validates shape and basic value categories, not full domain integrity.

## Entity Overview

The platform model contains 14 entities:

| Domain | Entity | Description |
| --- | --- | --- |
| Location Hierarchy | Customer | Top-level customer organization |
| Location Hierarchy | Site | Physical site under a customer |
| Location Hierarchy | Building | Building inside a site |
| Location Hierarchy | Level | Floor or level inside a building |
| Location Hierarchy | Space | Specific leasable, owned, or common space on a level |
| Tenants | Company | Commercial tenant organization |
| Tenants | Apartment | Residential apartment/unit label |
| Bookings | BookableResource | Resource that can be reserved |
| Bookings | Booking | Reservation made by a user for a resource |
| Identity & Access | User | End-user profile |
| Identity & Access | SiteProfile | User membership/context at a site |
| Identity & Access | Role | Permission bundle scoped to a domain level |
| Identity & Access | Group | Named user grouping |
| Identity & Access | Interest | Named preference/topic classification |

## Domain Relationships

The intended hierarchy and references are:

```text
Customer
  -> Site
    -> Building
      -> Level
        -> Space

Building
  -> BookableResource
    -> Booking

User
  -> SiteProfile

SiteProfile
  -> Site
  -> optional Company

Booking
  -> User
  -> BookableResource
```

The model includes several ID reference fields such as `customerId`, `siteId`, `buildingId`, `levelId`, `userId`, `companyId`, and `bookableResourceId`. These express intended relationships, but the API does not verify that the referenced record actually exists.

## Detailed Entity Documentation

### 1. Customer

Represents a top-level customer account that owns one or more sites.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Customer display name |
| `region` | string | Yes | Any string | Geographic or operating region |
| `status` | string | Yes | `active`, `inactive` | Current customer lifecycle status |

**Relationships**

- One customer can be associated with multiple sites.
- Sites reference customers through `customerId`.

**Example**

```json
{
  "name": "Acme Corp",
  "region": "APAC",
  "status": "active"
}
```

### 2. Site

Represents a physical site or property under a customer.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Site name |
| `address` | string | Yes | Any string | Physical address |
| `timezone` | string | Yes | Any string | Site timezone identifier |
| `siteType` | string | Yes | `commercial`, `residential`, `mixed` | Site classification |
| `customerId` | string | Yes | Any string | Reference to the owning customer |

**Relationships**

- Each site belongs to one customer.
- A site can contain multiple buildings.
- A site can be linked to users through `SiteProfile`.

**Example**

```json
{
  "name": "100 Collins St",
  "address": "100 Collins Street, Melbourne",
  "timezone": "Australia/Melbourne",
  "siteType": "commercial",
  "customerId": "cust-uuid-001"
}
```

### 3. Building

Represents a building inside a site.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Building name |
| `displayOrder` | number | Yes | Any number | Sorting position within a site |
| `siteId` | string | Yes | Any string | Reference to the parent site |

**Relationships**

- Each building belongs to one site.
- A building can contain multiple levels.
- A building can host multiple bookable resources.

**Example**

```json
{
  "name": "Tower A",
  "displayOrder": 1,
  "siteId": "site-uuid-001"
}
```

### 4. Level

Represents a floor or level within a building.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Level label |
| `displayOrder` | number | Yes | Any number | Sorting position within the building |
| `spaceCount` | number | Yes | Any number | Number of spaces on the level |
| `buildingId` | string | Yes | Any string | Reference to the parent building |

**Relationships**

- Each level belongs to one building.
- A level can contain multiple spaces.

**Example**

```json
{
  "name": "Level 10",
  "displayOrder": 10,
  "spaceCount": 5,
  "buildingId": "bldg-uuid-001"
}
```

### 5. Space

Represents a specific location within a level, such as a suite or common area.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Space name or identifier |
| `ownershipType` | string | Yes | `leased`, `owned`, `common` | Ownership/use classification |
| `levelId` | string | Yes | Any string | Reference to the parent level |

**Relationships**

- Each space belongs to one level.

**Example**

```json
{
  "name": "Suite 1001",
  "ownershipType": "leased",
  "levelId": "lvl-uuid-001"
}
```

### 6. Company

Represents a commercial tenant organization.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Company name |
| `industry` | string | Yes | Any string | Industry or sector |
| `attributes` | array of strings | No | String array | Optional tags or classification labels |
| `approvedDomains` | array of strings | No | String array | Optional list of email domains approved for matching users |
| `userApproval` | string | Yes | `automatic`, `manual` | User approval workflow mode |

**Relationships**

- A company can be associated with one or more site profiles.
- `companyId` appears as an optional reference inside `SiteProfile`.

**Example**

```json
{
  "name": "Acme Pty Ltd",
  "industry": "Technology",
  "attributes": ["premium"],
  "approvedDomains": ["acme.com"],
  "userApproval": "automatic"
}
```

### 7. Apartment

Represents a residential apartment or unit label.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Apartment or unit identifier |

**Relationships**

- No explicit foreign keys are defined in the current schema.

**Example**

```json
{
  "name": "Apt 42B"
}
```

### 8. BookableResource

Represents a reservable resource such as a meeting room or shared facility.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Resource name |
| `description` | string | No | Any string | Optional resource description |
| `capacity` | number | Yes | Any number | Maximum supported capacity |
| `location` | string | Yes | Any string | Human-readable resource location |
| `status` | string | Yes | `active`, `inactive` | Resource availability status |
| `photos` | array of strings | No | String array | Optional resource image URLs or identifiers |
| `buildingId` | string | Yes | Any string | Reference to the building containing the resource |

**Relationships**

- Each bookable resource belongs to one building.
- A resource can have multiple bookings.

**Example**

```json
{
  "name": "Board Room 1",
  "description": "Main boardroom on level 12",
  "capacity": 12,
  "location": "Level 12",
  "status": "active",
  "photos": ["http://img.com/1.jpg"],
  "buildingId": "bldg-uuid-001"
}
```

### 9. Booking

Represents a reservation created by a user for a bookable resource.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `startTime` | date string | Yes | Valid date string | Booking start timestamp |
| `endTime` | date string | Yes | Valid date string | Booking end timestamp |
| `status` | string | Yes | `pending`, `confirmed`, `cancelled` | Booking workflow state |
| `notes` | string | No | Any string | Optional free-form notes |
| `userId` | string | Yes | Any string | Reference to the booking user |
| `bookableResourceId` | string | Yes | Any string | Reference to the reserved resource |

**Relationships**

- Each booking belongs to one user.
- Each booking belongs to one bookable resource.

**Important validation note**

The API checks that `startTime` and `endTime` are parseable dates, but it does not verify that the end is after the start or that bookings do not overlap.

**Example**

```json
{
  "startTime": "2026-03-16T09:00:00Z",
  "endTime": "2026-03-16T10:00:00Z",
  "status": "pending",
  "notes": "Quarterly review",
  "userId": "user-uuid-001",
  "bookableResourceId": "res-uuid-001"
}
```

### 10. User

Represents an end-user identity inside the platform.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `firstName` | string | Yes | Any string | User first name |
| `lastName` | string | Yes | Any string | User last name |
| `email` | string | Yes | Any string | User email address |
| `emailVerified` | boolean | Yes | `true`, `false` | Whether email verification has occurred |
| `mobileNumber` | string | No | Any string | Optional mobile phone number |
| `status` | string | Yes | `active`, `inactive`, `pending` | User lifecycle status |
| `userType` | string | Yes | `commercial`, `residential`, `visitor` | High-level user classification |
| `uuid` | string | Yes | Any string | Internal unique identifier |
| `auth0Id` | string | Yes | Any string | External Auth0 identity identifier |
| `memberSince` | date string | Yes | Valid date string | Membership start timestamp |

**Relationships**

- A user can have one or more site profiles.
- A user can create bookings.

**Important validation note**

The current validator treats `email`, `uuid`, and `auth0Id` as generic strings. It does not verify formal formatting.

**Example**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@acme.com",
  "emailVerified": true,
  "mobileNumber": "+61400000000",
  "status": "active",
  "userType": "commercial",
  "uuid": "user-uuid-001",
  "auth0Id": "auth0|abc123",
  "memberSince": "2025-01-01T00:00:00Z"
}
```

### 11. SiteProfile

Represents the association between a user and a site, optionally linked to a company.

This entity is one of the most important join structures in the model because it adds site-specific context to a user.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `status` | string | Yes | `active`, `inactive` | Site membership status |
| `joinedAt` | date string | Yes | Valid date string | Date the user joined the site |
| `isActive` | boolean | Yes | `true`, `false` | Explicit active flag |
| `userId` | string | Yes | Any string | Reference to the user |
| `siteId` | string | Yes | Any string | Reference to the site |
| `companyId` | string | No | Any string | Optional reference to a commercial company |

**Relationships**

- Each site profile belongs to one user.
- Each site profile belongs to one site.
- A site profile may also belong to one company.

**Modeling note**

This design allows the same user to have different site-level memberships and statuses across multiple sites.

**Example**

```json
{
  "status": "active",
  "joinedAt": "2025-06-01T00:00:00Z",
  "isActive": true,
  "userId": "user-uuid-001",
  "siteId": "site-uuid-001",
  "companyId": "comp-uuid-001"
}
```

### 12. Role

Represents a named permission bundle with a defined scope level.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Role name |
| `description` | string | No | Any string | Optional role description |
| `scopeLevel` | string | Yes | `site`, `building`, `company` | Domain level where the role applies |
| `permissions` | array of strings | Yes | String array | Permission identifiers granted by the role |

**Relationships**

- No direct foreign keys are defined in the current schema.
- Roles are modeled as reusable authorization definitions.

**Example**

```json
{
  "name": "Property Manager",
  "description": "Manages site operations",
  "scopeLevel": "site",
  "permissions": ["read:users", "write:content"]
}
```

### 13. Group

Represents a named grouping construct.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Group name |

**Relationships**

- No membership join entity is currently defined in the schema.

**Example**

```json
{
  "name": "VIP Members"
}
```

### 14. Interest

Represents a named interest or preference classification.

**Fields**

| Field | Type | Required | Allowed Values | Description |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | Any string | Interest label |

**Relationships**

- No user-interest join entity is currently defined in the schema.

**Example**

```json
{
  "name": "Wellness"
}
```

## Enumerations

For quick reference, these are the enum-constrained fields in the current model:

| Entity | Field | Allowed Values |
| --- | --- | --- |
| Customer | `status` | `active`, `inactive` |
| Site | `siteType` | `commercial`, `residential`, `mixed` |
| Space | `ownershipType` | `leased`, `owned`, `common` |
| Company | `userApproval` | `automatic`, `manual` |
| BookableResource | `status` | `active`, `inactive` |
| Booking | `status` | `pending`, `confirmed`, `cancelled` |
| User | `status` | `active`, `inactive`, `pending` |
| User | `userType` | `commercial`, `residential`, `visitor` |
| SiteProfile | `status` | `active`, `inactive` |
| Role | `scopeLevel` | `site`, `building`, `company` |

## API Endpoints

All validation routes are mounted under `/api/v1`.

| Method | Endpoint | Entity |
| --- | --- | --- |
| `POST` | `/api/v1/customers` | Customer |
| `POST` | `/api/v1/sites` | Site |
| `POST` | `/api/v1/buildings` | Building |
| `POST` | `/api/v1/levels` | Level |
| `POST` | `/api/v1/spaces` | Space |
| `POST` | `/api/v1/companies` | Company |
| `POST` | `/api/v1/apartments` | Apartment |
| `POST` | `/api/v1/bookable-resources` | BookableResource |
| `POST` | `/api/v1/bookings` | Booking |
| `POST` | `/api/v1/users` | User |
| `POST` | `/api/v1/site-profiles` | SiteProfile |
| `POST` | `/api/v1/roles` | Role |
| `POST` | `/api/v1/groups` | Group |
| `POST` | `/api/v1/interests` | Interest |

## Response Format

### Valid payload

```json
{
  "valid": true,
  "received": {
    "name": "Acme Corp",
    "region": "APAC",
    "status": "active"
  }
}
```

### Invalid payload

```json
{
  "valid": false,
  "errors": [
    "'status' must be one of: active, inactive"
  ]
}
```

## Running the Project

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

By default, the app entry point is [`src/index.js`](/home/afonsolelis/repositorios/inteli/equiem/src/index.js).

### Development mode

```bash
npm run dev
```

### Run tests

```bash
npm test
```

## Swagger Documentation

Interactive API documentation is available when the server is running:

- Swagger UI: `GET /docs`
- OpenAPI JSON: `GET /docs.json`

The OpenAPI contract is generated from [`src/swagger.js`](/home/afonsolelis/repositorios/inteli/equiem/src/swagger.js) and route annotations in [`src/routes/index.js`](/home/afonsolelis/repositorios/inteli/equiem/src/routes/index.js).

## Testing Coverage

The test suite validates:

- one valid payload for each entity
- missing required fields
- wrong primitive types
- enum violations
- optional-field acceptance for selected entities

See:

- [`tests/endpoints.test.js`](/home/afonsolelis/repositorios/inteli/equiem/tests/endpoints.test.js)
- [`tests/validator.test.js`](/home/afonsolelis/repositorios/inteli/equiem/tests/validator.test.js)

## Current Model Limitations

This project documents and validates the current model as implemented, but there are some intentional or current limitations:

- No database or persistence mechanism
- No create/read/update/delete lifecycle beyond validation
- No relationship existence checks
- No schema for many-to-many joins such as user-groups or user-interests
- No apartment-to-site or apartment-to-user relation in the current code
- No advanced business validation for booking time windows or resource conflicts
- No strict format validation for email, UUID, URL, timezone, or phone fields

## Suggested Next Steps

If this project evolves beyond payload validation, likely improvements would be:

- add referential integrity checks
- enforce stronger formats with dedicated validators
- reject unknown properties when strict contracts are required
- introduce persistent storage and entity retrieval endpoints
- model join tables for groups, interests, roles, and apartment associations
- add business rules for booking and membership consistency

## Summary

The Equiem One Platform Data Model API is a schema-driven validation service for a multi-domain platform model covering property hierarchy, tenancy, bookings, and identity/access. Its data model is explicit, test-backed, and exposed through both REST endpoints and Swagger documentation, making it a clear foundation for integration validation and future expansion into a fuller platform service.

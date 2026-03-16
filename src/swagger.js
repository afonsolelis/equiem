const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Equiem One — Platform Data Model API',
      version: '1.0.0',
      description:
        'Receives POST requests for each entity in the Equiem One data model, ' +
        'validates field types and required fields, and returns whether the payload is valid.',
    },
    tags: [
      { name: 'Location Hierarchy', description: 'Customer → Site → Building → Level → Space' },
      { name: 'Tenants',            description: 'Company (commercial) and Apartment (residential)' },
      { name: 'Bookings',           description: 'BookableResource and Booking' },
      { name: 'Identity & Access',  description: 'User, SiteProfile, Role, Group, Interest' },
    ],
    components: {
      responses: {
        Valid: {
          description: 'Payload is valid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  valid:     { type: 'boolean', example: true },
                  received:  { type: 'object' },
                },
              },
            },
          },
        },
        Invalid: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  valid:  { type: 'boolean', example: false },
                  errors: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
      },
      schemas: {
        CustomerInput: {
          type: 'object', required: ['name', 'region', 'status'],
          properties: {
            name:   { type: 'string', example: 'Acme Corp' },
            region: { type: 'string', example: 'APAC' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
          },
        },
        SiteInput: {
          type: 'object', required: ['name', 'address', 'timezone', 'siteType', 'customerId'],
          properties: {
            name:       { type: 'string', example: '100 Collins St' },
            address:    { type: 'string', example: '100 Collins Street, Melbourne' },
            timezone:   { type: 'string', example: 'Australia/Melbourne' },
            siteType:   { type: 'string', enum: ['commercial', 'residential', 'mixed'] },
            customerId: { type: 'string', example: 'cust-uuid-001' },
          },
        },
        BuildingInput: {
          type: 'object', required: ['name', 'displayOrder', 'siteId'],
          properties: {
            name:         { type: 'string', example: 'Tower A' },
            displayOrder: { type: 'integer', example: 1 },
            siteId:       { type: 'string', example: 'site-uuid-001' },
          },
        },
        LevelInput: {
          type: 'object', required: ['name', 'displayOrder', 'spaceCount', 'buildingId'],
          properties: {
            name:         { type: 'string', example: 'Level 10' },
            displayOrder: { type: 'integer', example: 10 },
            spaceCount:   { type: 'integer', example: 5 },
            buildingId:   { type: 'string', example: 'bldg-uuid-001' },
          },
        },
        SpaceInput: {
          type: 'object', required: ['name', 'ownershipType', 'levelId'],
          properties: {
            name:          { type: 'string', example: 'Suite 1001' },
            ownershipType: { type: 'string', enum: ['leased', 'owned', 'common'] },
            levelId:       { type: 'string', example: 'lvl-uuid-001' },
          },
        },
        CompanyInput: {
          type: 'object', required: ['name', 'industry', 'userApproval'],
          properties: {
            name:            { type: 'string', example: 'Acme Pty Ltd' },
            industry:        { type: 'string', example: 'Technology' },
            attributes:      { type: 'array', items: { type: 'string' }, example: ['premium'] },
            approvedDomains: { type: 'array', items: { type: 'string' }, example: ['acme.com'] },
            userApproval:    { type: 'string', enum: ['automatic', 'manual'] },
          },
        },
        ApartmentInput: {
          type: 'object', required: ['name'],
          properties: {
            name: { type: 'string', example: 'Apt 42B' },
          },
        },
        BookableResourceInput: {
          type: 'object', required: ['name', 'capacity', 'location', 'status', 'buildingId'],
          properties: {
            name:        { type: 'string', example: 'Board Room 1' },
            description: { type: 'string', example: 'Main boardroom on level 12' },
            capacity:    { type: 'integer', example: 12 },
            location:    { type: 'string', example: 'Level 12' },
            status:      { type: 'string', enum: ['active', 'inactive'] },
            photos:      { type: 'array', items: { type: 'string' } },
            buildingId:  { type: 'string', example: 'bldg-uuid-001' },
          },
        },
        BookingInput: {
          type: 'object', required: ['startTime', 'endTime', 'status', 'userId', 'bookableResourceId'],
          properties: {
            startTime:          { type: 'string', format: 'date-time', example: '2026-03-16T09:00:00Z' },
            endTime:            { type: 'string', format: 'date-time', example: '2026-03-16T10:00:00Z' },
            status:             { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
            notes:              { type: 'string', example: 'Quarterly review' },
            userId:             { type: 'string', example: 'user-uuid-001' },
            bookableResourceId: { type: 'string', example: 'res-uuid-001' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'emailVerified', 'status', 'userType', 'uuid', 'auth0Id', 'memberSince'],
          properties: {
            firstName:     { type: 'string', example: 'Jane' },
            lastName:      { type: 'string', example: 'Doe' },
            email:         { type: 'string', example: 'jane.doe@acme.com' },
            emailVerified: { type: 'boolean', example: true },
            mobileNumber:  { type: 'string', example: '+61400000000' },
            status:        { type: 'string', enum: ['active', 'inactive', 'pending'] },
            userType:      { type: 'string', enum: ['commercial', 'residential', 'visitor'] },
            uuid:          { type: 'string', example: 'user-uuid-001' },
            auth0Id:       { type: 'string', example: 'auth0|abc123' },
            memberSince:   { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00Z' },
          },
        },
        SiteProfileInput: {
          type: 'object', required: ['status', 'joinedAt', 'isActive', 'userId', 'siteId'],
          properties: {
            status:    { type: 'string', enum: ['active', 'inactive'] },
            joinedAt:  { type: 'string', format: 'date-time', example: '2025-06-01T00:00:00Z' },
            isActive:  { type: 'boolean', example: true },
            userId:    { type: 'string', example: 'user-uuid-001' },
            siteId:    { type: 'string', example: 'site-uuid-001' },
            companyId: { type: 'string', example: 'comp-uuid-001' },
          },
        },
        RoleInput: {
          type: 'object', required: ['name', 'scopeLevel', 'permissions'],
          properties: {
            name:        { type: 'string', example: 'Property Manager' },
            description: { type: 'string', example: 'Manages site operations' },
            scopeLevel:  { type: 'string', enum: ['site', 'building', 'company'] },
            permissions: { type: 'array', items: { type: 'string' }, example: ['read:users', 'write:content'] },
          },
        },
        GroupInput: {
          type: 'object', required: ['name'],
          properties: {
            name: { type: 'string', example: 'VIP Members' },
          },
        },
        InterestInput: {
          type: 'object', required: ['name'],
          properties: {
            name: { type: 'string', example: 'Wellness' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/index.js'],
};

module.exports = swaggerJsdoc(options);

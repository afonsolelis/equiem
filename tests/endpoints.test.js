const request = require('supertest');
const app = require('../src/app');

// ─── helpers ─────────────────────────────────────────────────────────────────
const post = (path, body) => request(app).post(`/api/v1${path}`).send(body);

// ─── Fixtures: one valid payload per entity ───────────────────────────────────
const valid = {
  customer: { name: 'Acme', region: 'APAC', status: 'active' },

  site: { name: 'HQ', address: '100 Collins St', timezone: 'Australia/Melbourne',
          siteType: 'commercial', customerId: 'cust-1' },

  building: { name: 'Tower A', displayOrder: 1, siteId: 'site-1' },

  level: { name: 'L10', displayOrder: 10, spaceCount: 5, buildingId: 'bldg-1' },

  space: { name: 'Suite 1001', ownershipType: 'leased', levelId: 'lvl-1' },

  company: { name: 'Acme Pty', industry: 'Tech', userApproval: 'automatic',
             attributes: ['premium'], approvedDomains: ['acme.com'] },

  apartment: { name: 'Apt 42B' },

  bookableResource: { name: 'Board Room 1', capacity: 12, location: 'L12',
                      status: 'active', buildingId: 'bldg-1',
                      description: 'Main room', photos: ['http://img.com/1.jpg'] },

  booking: { startTime: '2026-03-16T09:00:00Z', endTime: '2026-03-16T10:00:00Z',
             status: 'pending', userId: 'user-1', bookableResourceId: 'res-1',
             notes: 'QR' },

  user: { firstName: 'Jane', lastName: 'Doe', email: 'jane@acme.com',
          emailVerified: true, status: 'active', userType: 'commercial',
          uuid: 'u-1', auth0Id: 'auth0|abc', memberSince: '2025-01-01T00:00:00Z',
          mobileNumber: '+61400000000' },

  siteProfile: { status: 'active', joinedAt: '2025-06-01T00:00:00Z',
                 isActive: true, userId: 'user-1', siteId: 'site-1' },

  role: { name: 'PM', scopeLevel: 'site', permissions: ['read:users'],
          description: 'Property Manager' },

  group: { name: 'VIP' },

  interest: { name: 'Wellness' },
};

// ─── Generic helper to build invalid payloads ─────────────────────────────────
const without = (obj, ...keys) => {
  const copy = { ...obj };
  keys.forEach(k => delete copy[k]);
  return copy;
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /customers', () => {
  it('200 with valid payload', async () => {
    const res = await post('/customers', valid.customer);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.received).toMatchObject(valid.customer);
  });

  it('400 when name is missing', async () => {
    const res = await post('/customers', without(valid.customer, 'name'));
    expect(res.status).toBe(400);
    expect(res.body.valid).toBe(false);
    expect(res.body.errors.some(e => e.includes("'name'"))).toBe(true);
  });

  it('400 when status is invalid enum', async () => {
    const res = await post('/customers', { ...valid.customer, status: 'unknown' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'status'"))).toBe(true);
  });

  it('400 when name is wrong type', async () => {
    const res = await post('/customers', { ...valid.customer, name: 42 });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'name' must be a string"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SITE
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /sites', () => {
  it('200 with valid payload', async () => {
    const res = await post('/sites', valid.site);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  it('400 when customerId is missing', async () => {
    const res = await post('/sites', without(valid.site, 'customerId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'customerId'"))).toBe(true);
  });

  it('400 when siteType is invalid enum', async () => {
    const res = await post('/sites', { ...valid.site, siteType: 'office' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'siteType'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILDING
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /buildings', () => {
  it('200 with valid payload', async () => {
    expect((await post('/buildings', valid.building)).status).toBe(200);
  });

  it('400 when displayOrder is not a number', async () => {
    const res = await post('/buildings', { ...valid.building, displayOrder: 'one' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'displayOrder'"))).toBe(true);
  });

  it('400 when siteId is missing', async () => {
    const res = await post('/buildings', without(valid.building, 'siteId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'siteId'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /levels', () => {
  it('200 with valid payload', async () => {
    expect((await post('/levels', valid.level)).status).toBe(200);
  });

  it('400 when spaceCount is missing', async () => {
    const res = await post('/levels', without(valid.level, 'spaceCount'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'spaceCount'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SPACE
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /spaces', () => {
  it('200 with valid payload', async () => {
    expect((await post('/spaces', valid.space)).status).toBe(200);
  });

  it('400 when ownershipType is invalid enum', async () => {
    const res = await post('/spaces', { ...valid.space, ownershipType: 'rented' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'ownershipType'"))).toBe(true);
  });

  it('400 when levelId is missing', async () => {
    const res = await post('/spaces', without(valid.space, 'levelId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'levelId'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /companies', () => {
  it('200 with valid payload (full)', async () => {
    expect((await post('/companies', valid.company)).status).toBe(200);
  });

  it('200 without optional arrays', async () => {
    const res = await post('/companies', without(valid.company, 'attributes', 'approvedDomains'));
    expect(res.status).toBe(200);
  });

  it('400 when userApproval is invalid enum', async () => {
    const res = await post('/companies', { ...valid.company, userApproval: 'maybe' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'userApproval'"))).toBe(true);
  });

  it('400 when attributes contains non-strings', async () => {
    const res = await post('/companies', { ...valid.company, attributes: [1, 2] });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'attributes'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// APARTMENT
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /apartments', () => {
  it('200 with valid payload', async () => {
    expect((await post('/apartments', valid.apartment)).status).toBe(200);
  });

  it('400 when name is missing', async () => {
    const res = await post('/apartments', {});
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'name'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BOOKABLE RESOURCE
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /bookable-resources', () => {
  it('200 with valid payload', async () => {
    expect((await post('/bookable-resources', valid.bookableResource)).status).toBe(200);
  });

  it('200 without optional fields', async () => {
    const res = await post('/bookable-resources',
      without(valid.bookableResource, 'description', 'photos'));
    expect(res.status).toBe(200);
  });

  it('400 when capacity is not a number', async () => {
    const res = await post('/bookable-resources', { ...valid.bookableResource, capacity: 'many' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'capacity'"))).toBe(true);
  });

  it('400 when status is invalid enum', async () => {
    const res = await post('/bookable-resources', { ...valid.bookableResource, status: 'busy' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'status'"))).toBe(true);
  });

  it('400 when buildingId is missing', async () => {
    const res = await post('/bookable-resources', without(valid.bookableResource, 'buildingId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'buildingId'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /bookings', () => {
  it('200 with valid payload', async () => {
    expect((await post('/bookings', valid.booking)).status).toBe(200);
  });

  it('200 without optional notes', async () => {
    expect((await post('/bookings', without(valid.booking, 'notes'))).status).toBe(200);
  });

  it('400 when startTime is invalid date', async () => {
    const res = await post('/bookings', { ...valid.booking, startTime: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'startTime'"))).toBe(true);
  });

  it('400 when status is invalid enum', async () => {
    const res = await post('/bookings', { ...valid.booking, status: 'hold' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'status'"))).toBe(true);
  });

  it('400 when userId is missing', async () => {
    const res = await post('/bookings', without(valid.booking, 'userId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'userId'"))).toBe(true);
  });

  it('400 when bookableResourceId is missing', async () => {
    const res = await post('/bookings', without(valid.booking, 'bookableResourceId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'bookableResourceId'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /users', () => {
  it('200 with valid payload (commercial)', async () => {
    expect((await post('/users', valid.user)).status).toBe(200);
  });

  it('200 with userType residential', async () => {
    expect((await post('/users', { ...valid.user, userType: 'residential' })).status).toBe(200);
  });

  it('200 with userType visitor', async () => {
    expect((await post('/users', { ...valid.user, userType: 'visitor' })).status).toBe(200);
  });

  it('200 without optional mobileNumber', async () => {
    expect((await post('/users', without(valid.user, 'mobileNumber'))).status).toBe(200);
  });

  it('400 when userType is invalid enum', async () => {
    const res = await post('/users', { ...valid.user, userType: 'admin' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'userType'"))).toBe(true);
  });

  it('400 when emailVerified is not boolean', async () => {
    const res = await post('/users', { ...valid.user, emailVerified: 'yes' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'emailVerified'"))).toBe(true);
  });

  it('400 when memberSince is invalid date', async () => {
    const res = await post('/users', { ...valid.user, memberSince: 'yesterday' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'memberSince'"))).toBe(true);
  });

  it('400 when required fields are missing', async () => {
    const res = await post('/users', without(valid.user, 'email', 'auth0Id'));
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SITE PROFILE
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /site-profiles', () => {
  it('200 with valid payload', async () => {
    expect((await post('/site-profiles', valid.siteProfile)).status).toBe(200);
  });

  it('200 with optional companyId', async () => {
    const res = await post('/site-profiles', { ...valid.siteProfile, companyId: 'comp-1' });
    expect(res.status).toBe(200);
  });

  it('400 when joinedAt is invalid date', async () => {
    const res = await post('/site-profiles', { ...valid.siteProfile, joinedAt: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'joinedAt'"))).toBe(true);
  });

  it('400 when isActive is not boolean', async () => {
    const res = await post('/site-profiles', { ...valid.siteProfile, isActive: 1 });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'isActive'"))).toBe(true);
  });

  it('400 when siteId is missing', async () => {
    const res = await post('/site-profiles', without(valid.siteProfile, 'siteId'));
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'siteId'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ROLE
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /roles', () => {
  it('200 with valid payload', async () => {
    expect((await post('/roles', valid.role)).status).toBe(200);
  });

  it('200 without optional description', async () => {
    expect((await post('/roles', without(valid.role, 'description'))).status).toBe(200);
  });

  it('400 when scopeLevel is invalid enum', async () => {
    const res = await post('/roles', { ...valid.role, scopeLevel: 'global' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'scopeLevel'"))).toBe(true);
  });

  it('400 when permissions is not an array', async () => {
    const res = await post('/roles', { ...valid.role, permissions: 'read:all' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'permissions'"))).toBe(true);
  });

  it('400 when permissions contains non-strings', async () => {
    const res = await post('/roles', { ...valid.role, permissions: [1, 2] });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'permissions'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GROUP
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /groups', () => {
  it('200 with valid payload', async () => {
    expect((await post('/groups', valid.group)).status).toBe(200);
  });

  it('400 when name is missing', async () => {
    const res = await post('/groups', {});
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'name'"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEREST
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /interests', () => {
  it('200 with valid payload', async () => {
    expect((await post('/interests', valid.interest)).status).toBe(200);
  });

  it('400 when name is wrong type', async () => {
    const res = await post('/interests', { name: true });
    expect(res.status).toBe(400);
    expect(res.body.errors.some(e => e.includes("'name' must be a string"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Swagger & misc
// ─────────────────────────────────────────────────────────────────────────────
describe('Swagger', () => {
  it('GET /docs.json returns openapi spec', async () => {
    const res = await request(app).get('/docs.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.0');
    expect(res.body.info.title).toMatch(/Equiem/);
  });

  it('GET /docs returns swagger UI html', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/swagger/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// NOT found
// ─────────────────────────────────────────────────────────────────────────────
describe('404', () => {
  it('returns 404 for unknown route', async () => {
    const res = await request(app).post('/api/v1/unknown');
    expect(res.status).toBe(404);
  });
});

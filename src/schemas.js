/**
 * Field schemas for each entity in the Equiem One data model.
 * Each field: { type, required, enum?, items? }
 */

const schemas = {
  customer: {
    name:   { type: 'string',  required: true },
    region: { type: 'string',  required: true },
    status: { type: 'string',  required: true, enum: ['active', 'inactive'] },
  },

  site: {
    name:       { type: 'string', required: true },
    address:    { type: 'string', required: true },
    timezone:   { type: 'string', required: true },
    siteType:   { type: 'string', required: true, enum: ['commercial', 'residential', 'mixed'] },
    customerId: { type: 'string', required: true },
  },

  building: {
    name:         { type: 'string', required: true },
    displayOrder: { type: 'number', required: true },
    siteId:       { type: 'string', required: true },
  },

  level: {
    name:         { type: 'string', required: true },
    displayOrder: { type: 'number', required: true },
    spaceCount:   { type: 'number', required: true },
    buildingId:   { type: 'string', required: true },
  },

  space: {
    name:          { type: 'string', required: true },
    ownershipType: { type: 'string', required: true, enum: ['leased', 'owned', 'common'] },
    levelId:       { type: 'string', required: true },
  },

  company: {
    name:            { type: 'string',  required: true },
    industry:        { type: 'string',  required: true },
    attributes:      { type: 'array',   required: false, items: 'string' },
    approvedDomains: { type: 'array',   required: false, items: 'string' },
    userApproval:    { type: 'string',  required: true, enum: ['automatic', 'manual'] },
  },

  apartment: {
    name: { type: 'string', required: true },
  },

  bookableResource: {
    name:        { type: 'string', required: true },
    description: { type: 'string', required: false },
    capacity:    { type: 'number', required: true },
    location:    { type: 'string', required: true },
    status:      { type: 'string', required: true, enum: ['active', 'inactive'] },
    photos:      { type: 'array',  required: false, items: 'string' },
    buildingId:  { type: 'string', required: true },
  },

  booking: {
    startTime:          { type: 'date',   required: true },
    endTime:            { type: 'date',   required: true },
    status:             { type: 'string', required: true, enum: ['pending', 'confirmed', 'cancelled'] },
    notes:              { type: 'string', required: false },
    userId:             { type: 'string', required: true },
    bookableResourceId: { type: 'string', required: true },
  },

  user: {
    firstName:     { type: 'string',  required: true },
    lastName:      { type: 'string',  required: true },
    email:         { type: 'string',  required: true },
    emailVerified: { type: 'boolean', required: true },
    mobileNumber:  { type: 'string',  required: false },
    status:        { type: 'string',  required: true, enum: ['active', 'inactive', 'pending'] },
    userType:      { type: 'string',  required: true, enum: ['commercial', 'residential', 'visitor'] },
    uuid:          { type: 'string',  required: true },
    auth0Id:       { type: 'string',  required: true },
    memberSince:   { type: 'date',    required: true },
  },

  siteProfile: {
    status:    { type: 'string',  required: true, enum: ['active', 'inactive'] },
    joinedAt:  { type: 'date',    required: true },
    isActive:  { type: 'boolean', required: true },
    userId:    { type: 'string',  required: true },
    siteId:    { type: 'string',  required: true },
    companyId: { type: 'string',  required: false },
  },

  role: {
    name:        { type: 'string', required: true },
    description: { type: 'string', required: false },
    scopeLevel:  { type: 'string', required: true, enum: ['site', 'building', 'company'] },
    permissions: { type: 'array',  required: true, items: 'string' },
  },

  group: {
    name: { type: 'string', required: true },
  },

  interest: {
    name: { type: 'string', required: true },
  },
};

module.exports = schemas;

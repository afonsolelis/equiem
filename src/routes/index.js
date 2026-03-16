const express = require('express');
const router = express.Router();
const schemas = require('../schemas');
const { validate } = require('../validator');

/**
 * Factory: creates a POST /entity route that validates body against schema.
 */
function makeRoute(schemaKey) {
  return (req, res) => {
    const errors = validate(schemas[schemaKey], req.body);
    if (errors.length > 0) {
      return res.status(400).json({ valid: false, errors });
    }
    return res.status(200).json({ valid: true, received: req.body });
  };
}

// ─── Location Hierarchy ───────────────────────────────────────────────────────

/**
 * @swagger
 * /customers:
 *   post:
 *     tags: [Location Hierarchy]
 *     summary: Validate a Customer payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/customers', makeRoute('customer'));

/**
 * @swagger
 * /sites:
 *   post:
 *     tags: [Location Hierarchy]
 *     summary: Validate a Site payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/sites', makeRoute('site'));

/**
 * @swagger
 * /buildings:
 *   post:
 *     tags: [Location Hierarchy]
 *     summary: Validate a Building payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuildingInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/buildings', makeRoute('building'));

/**
 * @swagger
 * /levels:
 *   post:
 *     tags: [Location Hierarchy]
 *     summary: Validate a Level payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LevelInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/levels', makeRoute('level'));

/**
 * @swagger
 * /spaces:
 *   post:
 *     tags: [Location Hierarchy]
 *     summary: Validate a Space payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpaceInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/spaces', makeRoute('space'));

// ─── Tenant Entities ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /companies:
 *   post:
 *     tags: [Tenants]
 *     summary: Validate a Company payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/companies', makeRoute('company'));

/**
 * @swagger
 * /apartments:
 *   post:
 *     tags: [Tenants]
 *     summary: Validate an Apartment payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApartmentInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/apartments', makeRoute('apartment'));

// ─── Bookings ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /bookable-resources:
 *   post:
 *     tags: [Bookings]
 *     summary: Validate a BookableResource payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookableResourceInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/bookable-resources', makeRoute('bookableResource'));

/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Validate a Booking payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/bookings', makeRoute('booking'));

// ─── Identity & Access ────────────────────────────────────────────────────────

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Identity & Access]
 *     summary: Validate a User payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/users', makeRoute('user'));

/**
 * @swagger
 * /site-profiles:
 *   post:
 *     tags: [Identity & Access]
 *     summary: Validate a SiteProfile payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SiteProfileInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/site-profiles', makeRoute('siteProfile'));

/**
 * @swagger
 * /roles:
 *   post:
 *     tags: [Identity & Access]
 *     summary: Validate a Role payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/roles', makeRoute('role'));

/**
 * @swagger
 * /groups:
 *   post:
 *     tags: [Identity & Access]
 *     summary: Validate a Group payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/groups', makeRoute('group'));

/**
 * @swagger
 * /interests:
 *   post:
 *     tags: [Identity & Access]
 *     summary: Validate an Interest payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterestInput'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Valid'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post('/interests', makeRoute('interest'));

module.exports = router;

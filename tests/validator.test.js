const { validate } = require('../src/validator');

const schema = {
  name:    { type: 'string',  required: true },
  age:     { type: 'number',  required: true },
  active:  { type: 'boolean', required: true },
  dob:     { type: 'date',    required: false },
  tags:    { type: 'array',   required: false, items: 'string' },
  status:  { type: 'string',  required: true, enum: ['on', 'off'] },
};

describe('validator', () => {
  it('returns no errors for a fully valid body', () => {
    expect(validate(schema, {
      name: 'Alice', age: 30, active: true, status: 'on',
    })).toEqual([]);
  });

  it('reports missing required string', () => {
    const errs = validate(schema, { age: 30, active: true, status: 'on' });
    expect(errs).toContain("'name' is required and cannot be null or empty");
  });

  it('reports null required field', () => {
    const errs = validate(schema, { name: null, age: 30, active: true, status: 'on' });
    expect(errs).toContain("'name' is required and cannot be null or empty");
  });

  it('reports empty-string required field', () => {
    const errs = validate(schema, { name: '', age: 30, active: true, status: 'on' });
    expect(errs).toContain("'name' is required and cannot be null or empty");
  });

  it('reports wrong type for string field', () => {
    const errs = validate(schema, { name: 123, age: 30, active: true, status: 'on' });
    expect(errs.some(e => e.includes("'name' must be a string"))).toBe(true);
  });

  it('reports wrong type for number field', () => {
    const errs = validate(schema, { name: 'A', age: 'thirty', active: true, status: 'on' });
    expect(errs.some(e => e.includes("'age' must be a number"))).toBe(true);
  });

  it('reports NaN for number field', () => {
    const errs = validate(schema, { name: 'A', age: NaN, active: true, status: 'on' });
    expect(errs.some(e => e.includes("'age' must be a number"))).toBe(true);
  });

  it('reports wrong type for boolean field', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: 'yes', status: 'on' });
    expect(errs.some(e => e.includes("'active' must be a boolean"))).toBe(true);
  });

  it('reports invalid date', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'on', dob: 'not-a-date' });
    expect(errs.some(e => e.includes("'dob' must be a valid ISO date string"))).toBe(true);
  });

  it('accepts a valid date string', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'on', dob: '2025-01-01T00:00:00Z' });
    expect(errs).toEqual([]);
  });

  it('reports invalid enum value', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'maybe' });
    expect(errs.some(e => e.includes("'status' must be one of"))).toBe(true);
  });

  it('accepts valid enum value', () => {
    expect(validate(schema, { name: 'A', age: 1, active: true, status: 'off' })).toEqual([]);
  });

  it('reports non-array for array field', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'on', tags: 'notarray' });
    expect(errs.some(e => e.includes("'tags' must be an array"))).toBe(true);
  });

  it('reports array with non-string items', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'on', tags: [1, 2] });
    expect(errs.some(e => e.includes("'tags' must be an array of strings"))).toBe(true);
  });

  it('accepts valid array of strings', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'on', tags: ['x', 'y'] });
    expect(errs).toEqual([]);
  });

  it('skips optional field when undefined', () => {
    const errs = validate(schema, { name: 'A', age: 1, active: true, status: 'on' });
    expect(errs).toEqual([]);
  });
});

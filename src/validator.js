/**
 * Minimal field validator.
 * Checks required fields are present and non-null,
 * and that field types match the schema definition.
 *
 * Schema field definition:
 *   { type: 'string'|'number'|'boolean'|'date'|'array', required: bool, enum: [] }
 */
function validate(schema, body) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = body[field];
    const missing = value === undefined || value === null || value === '';

    if (rules.required && missing) {
      errors.push(`'${field}' is required and cannot be null or empty`);
      continue;
    }

    if (!rules.required && missing) continue;

    // Type checks
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string')
          errors.push(`'${field}' must be a string, got ${typeof value}`);
        else if (rules.enum && !rules.enum.includes(value))
          errors.push(`'${field}' must be one of: ${rules.enum.join(', ')}`);
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value))
          errors.push(`'${field}' must be a number`);
        break;

      case 'boolean':
        if (typeof value !== 'boolean')
          errors.push(`'${field}' must be a boolean`);
        break;

      case 'date':
        if (isNaN(Date.parse(value)))
          errors.push(`'${field}' must be a valid ISO date string`);
        break;

      case 'array':
        if (!Array.isArray(value))
          errors.push(`'${field}' must be an array`);
        else if (rules.items === 'string' && !value.every(i => typeof i === 'string'))
          errors.push(`'${field}' must be an array of strings`);
        break;
    }
  }

  return errors;
}

module.exports = { validate };

import { Validator, type Schema } from '@cfworker/json-schema';
import searchRequest from '../schemas/search-request.json';
import searchResponse from '../schemas/search-response.json';
import normalize from '../schemas/normalize.json';
import enrich from '../schemas/enrich.json';

export const schemas = {
  'search-request': searchRequest as Schema,
  'search-response': searchResponse as Schema,
  normalize: normalize as Schema,
  enrich: enrich as Schema,
};
export type SchemaName = keyof typeof schemas;

// Compiled once per isolate: the Workers free plan allows 10 ms of CPU per request.
const validators = Object.fromEntries(
  Object.entries(schemas).map(([name, schema]) => [name, new Validator(schema, '7', false)]),
) as Record<SchemaName, Validator>;

export type Validation = { ok: true } | { ok: false; errors: string[] };

// Errors are for tests only; they can quote input and must never reach a log line.
export function validateAgainst(name: SchemaName, value: unknown): Validation {
  const result = validators[name].validate(value);
  if (result.valid) return { ok: true };
  return { ok: false, errors: result.errors.map((e) => `${e.instanceLocation}: ${e.error}`) };
}

// Provider support for strict-mode keywords beyond structure is unverified, so the
// model gets structure only and the full schema is enforced on its reply.
export function structuralOnly(schema: Schema): Schema {
  const out: Schema = {};
  if (schema.type !== undefined) out.type = schema.type;
  if (schema.required) out.required = [...schema.required];
  if (typeof schema.additionalProperties === 'boolean') out.additionalProperties = schema.additionalProperties;
  if (schema.properties) {
    out.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, sub]) => [key, typeof sub === 'boolean' ? sub : structuralOnly(sub)]),
    );
  }
  if (schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items)) out.items = structuralOnly(schema.items);
  return out;
}

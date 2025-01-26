import type { OpenAPIAll, OpenAPILatest } from '../types/openapi';
import { OpenAPIVersion } from '../types/openapi';
import { migrate_2_0To3_0 } from './openapi-2_0';
import { migrate_3_0To3_1 } from './openapi-3_0';

export function detectVersion(openapi: OpenAPIAll.Document): OpenAPIVersion {
  if ('swagger' in openapi) {
    return OpenAPIVersion.V2_0;
  }

  if (openapi.openapi.startsWith('3.0')) {
    return OpenAPIVersion.V3_0;
  }

  if (openapi.openapi.startsWith('3.1')) {
    return OpenAPIVersion.V3_1;
  }

  throw new Error(`Unsupported OpenAPI version: ${openapi.openapi}`);
}

const migrations = [
  //
  { from: OpenAPIVersion.V2_0, migrate: migrate_2_0To3_0 },
  { from: OpenAPIVersion.V3_0, migrate: migrate_3_0To3_1 },
];

export function migrate(openapi: OpenAPIAll.Document) {
  return migrations.reduce((acc, { from, migrate }) => {
    if (detectVersion(acc) === from) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      return migrate(acc);
    }

    return acc;
  }, openapi) as OpenAPILatest.Document;
}

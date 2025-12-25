import { DocumentStatus } from './enums';
import { AuditFields } from './audit';

export type BaseDocument = AuditFields & {
  status: DocumentStatus;
};

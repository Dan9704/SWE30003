import { randomUUID } from 'crypto';

export function generateUUID() {
  return randomUUID();
}
 
export function generateTimestampId() {
  return Date.now().toString();
} 
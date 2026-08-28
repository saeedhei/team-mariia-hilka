// src\lib\couchdb.ts
import nano from 'nano';

if (!process.env.COUCH_URL) {
  throw new Error('COUCH_URL is missing from environment');
}

export const couch = nano(process.env.COUCH_URL);
export const kanbansDB = couch.db.use('kanban_test');

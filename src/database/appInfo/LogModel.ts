import Realm from 'realm';

export default class LogModel extends Realm.Object {
  static schema: Realm.ObjectSchema;
}

LogModel.schema = {
  name: "Log",
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    level: 'string',
    timestamp: 'date',
    context: 'string',
    message: 'string',
    sessionId: 'string'
  }
}

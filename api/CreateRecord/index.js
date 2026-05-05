const { v4: uuidv4 } = require('uuid');
const { getTableClient } = require('../shared');

module.exports = async function (context, req) {
  try {
    const { name, email, notes } = req.body || {};

    if (!name || !email) {
      context.res = { status: 400, body: 'Name and email are required.' };
      return;
    }

    const client = getTableClient();
    const entity = {
      partitionKey: 'default',
      rowKey: uuidv4(),
      name,
      email,
      notes: notes || '',
      createdDate: new Date().toISOString()
    };

    await client.createEntity(entity);

    context.res = {
      status: 201,
      body: { message: 'Created', entity }
    };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: 'Error creating record.' };
  }
};

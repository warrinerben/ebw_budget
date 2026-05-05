const { getTableClient } = require('../shared');

module.exports = async function (context, req) {
  try {
    const { partitionKey, rowKey, name, email, notes } = req.body || {};

    if (!partitionKey || !rowKey) {
      context.res = { status: 400, body: 'partitionKey and rowKey are required.' };
      return;
    }

    const client = getTableClient();
    const existing = await client.getEntity(partitionKey, rowKey);

    existing.name = name ?? existing.name;
    existing.email = email ?? existing.email;
    existing.notes = notes ?? existing.notes;

    await client.updateEntity(existing, 'Replace');

    context.res = {
      status: 200,
      body: { message: 'Updated' }
    };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: 'Error updating record.' };
  }
};

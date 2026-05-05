const { getTableClient } = require('../shared');

module.exports = async function (context, req) {
  try {
    const { partitionKey, rowKey } = req.body || {};

    if (!partitionKey || !rowKey) {
      context.res = { status: 400, body: 'partitionKey and rowKey are required.' };
      return;
    }

    const client = getTableClient();
    await client.deleteEntity(partitionKey, rowKey);

    context.res = {
      status: 200,
      body: { message: 'Deleted' }
    };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: 'Error deleting record.' };
  }
};

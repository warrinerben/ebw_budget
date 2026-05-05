const { getTableClient, mapEntityToDto } = require('../shared');

module.exports = async function (context, req) {
  try {
    const client = getTableClient();
    const entities = client.listEntities({ queryOptions: { filter: `PartitionKey eq 'default'` } });

    const results = [];
    for await (const entity of entities) {
      results.push(mapEntityToDto(entity));
    }

    context.res = {
      status: 200,
      body: results
    };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: 'Error fetching records.' };
  }
};

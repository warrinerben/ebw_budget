const { TableClient, AzureSASCredential, AzureNamedKeyCredential } = require('@azure/data-tables');

function getTableClient() {
  const connectionString = process.env.STORAGE_CONNECTION_STRING;
  const tableName = process.env.TABLE_NAME || 'AppData';

  if (!connectionString) {
    throw new Error('STORAGE_CONNECTION_STRING is not set.');
  }

  const client = TableClient.fromConnectionString(connectionString, tableName);
  return client;
}

function mapEntityToDto(entity) {
  return {
    partitionKey: entity.partitionKey,
    rowKey: entity.rowKey,
    name: entity.name || '',
    email: entity.email || '',
    notes: entity.notes || '',
    createdDate: entity.createdDate || ''
  };
}

module.exports = {
  getTableClient,
  mapEntityToDto
};

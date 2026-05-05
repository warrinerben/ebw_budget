const apiBase = '/api';

const form = document.getElementById('recordForm');
const formMessage = document.getElementById('formMessage');
const listMessage = document.getElementById('listMessage');
const recordsBody = document.getElementById('recordsBody');

async function fetchRecords() {
  listMessage.textContent = 'Loading...';
  recordsBody.innerHTML = '';

  try {
    const res = await fetch(`${apiBase}/GetRecords`);
    if (!res.ok) throw new Error('Failed to load records');
    const data = await res.json();

    if (!data || data.length === 0) {
      listMessage.textContent = 'No records yet.';
      return;
    }

    listMessage.textContent = '';
    data.forEach(addRecordRow);
  } catch (err) {
    console.error(err);
    listMessage.textContent = 'Error loading records.';
  }
}

function addRecordRow(record) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${record.name || ''}</td>
    <td>${record.email || ''}</td>
    <td>${record.notes || ''}</td>
    <td>${record.createdDate || ''}</td>
    <td class="actions">
      <button data-action="edit">Edit</button>
      <button data-action="delete">Delete</button>
    </td>
  `;

  tr.dataset.partitionKey = record.partitionKey;
  tr.dataset.rowKey = record.rowKey;

  tr.querySelector('[data-action="delete"]').addEventListener('click', () =>
    deleteRecord(record.partitionKey, record.rowKey)
  );

  tr.querySelector('[data-action="edit"]').addEventListener('click', () =>
    editRecordPrompt(record)
  );

  recordsBody.appendChild(tr);
}

async function deleteRecord(partitionKey, rowKey) {
  if (!confirm('Delete this record?')) return;

  try {
    const res = await fetch(`${apiBase}/DeleteRecord`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partitionKey, rowKey })
    });
    if (!res.ok) throw new Error('Delete failed');

    await fetchRecords();
  } catch (err) {
    console.error(err);
    alert('Error deleting record.');
  }
}

function editRecordPrompt(record) {
  const name = prompt('Name:', record.name || '');
  if (name === null) return;
  const email = prompt('Email:', record.email || '');
  if (email === null) return;
  const notes = prompt('Notes:', record.notes || '');

  updateRecord(record.partitionKey, record.rowKey, { name, email, notes });
}

async function updateRecord(partitionKey, rowKey, payload) {
  try {
    const res = await fetch(`${apiBase}/UpdateRecord`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partitionKey, rowKey, ...payload })
    });
    if (!res.ok) throw new Error('Update failed');

    await fetchRecords();
  } catch (err) {
    console.error(err);
    alert('Error updating record.');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const notes = document.getElementById('notes').value.trim();

  if (!name || !email) {
    formMessage.textContent = 'Name and Email are required.';
    return;
  }

  try:
    const res = await fetch(`${apiBase}/CreateRecord`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, notes })
    });
    if (!res.ok) throw new Error('Create failed');

    form.reset();
    formMessage.textContent = 'Saved.';
    await fetchRecords();
  } catch (err) {
    console.error(err);
    formMessage.textContent = 'Error saving record.';
  }
});

fetchRecords();

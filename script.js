const form = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentsTable tbody');
const searchInput = document.getElementById('search');
const clearAllBtn = document.getElementById('clearAll');
const resetBtn = document.getElementById('resetBtn');

let students = JSON.parse(localStorage.getItem('students_final')) || [];

// Render table rows with action buttons always visible
function render(list = students){
  tableBody.innerHTML = '';
  if(!list.length){
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6" style="text-align:center;color:#6b7280;padding:24px">No student records yet</td>';
    tableBody.appendChild(tr);
    return;
  }
  list.forEach((s, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.roll)}</td>
      <td>${escapeHtml(s.course||'')}</td>
      <td>${escapeHtml(s.year)}</td>
      <td>${escapeHtml(s.cgpa)}</td>
      <td><div class="action-group">
           <button class="action-btn edit" data-i="${idx}" onclick="onEdit(${idx})">Edit</button>
           <button class="action-btn delete" data-i="${idx}" onclick="onDelete(${idx})">Delete</button>
          </div></td>
    `;
    tableBody.appendChild(tr);
  });
}

// safe text
function escapeHtml(t){ return t===undefined||t===null? '': String(t).replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// add / update flow
form.addEventListener('submit', e=>{
  e.preventDefault();
  const name = form.querySelector('#name').value.trim();
  const roll = form.querySelector('#roll').value.trim();
  const year = form.querySelector('#year').value;
  const cgpa = form.querySelector('#cgpa').value.trim();
  const course = form.querySelector('#course').value.trim();

  if(!name || !roll){ alert('Name and Roll are required'); return; }

  // if edit mode stored as data-edit-index on form
  const editIndex = form.dataset.editIndex;
  if(editIndex !== undefined){
    students[Number(editIndex)] = {name, roll, year, cgpa, course};
    delete form.dataset.editIndex;
    form.querySelector('#addBtn').textContent = 'Add Student';
  } else {
    students.push({name, roll, year, cgpa, course});
  }
  saveAndRender();
  form.reset();
});

// Edit
window.onEdit = function(i){
  const s = students[i];
  form.querySelector('#name').value = s.name;
  form.querySelector('#roll').value = s.roll;
  form.querySelector('#year').value = s.year;
  form.querySelector('#cgpa').value = s.cgpa;
  form.querySelector('#course').value = s.course;
  form.dataset.editIndex = i;
  form.querySelector('#addBtn').textContent = 'Update Student';
  window.scrollTo({top:0, behavior:'smooth'});
}

// Delete
window.onDelete = function(i){
  if(!confirm('Delete this student?')) return;
  students.splice(i,1);
  saveAndRender();
}

// Search
searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q) return render(students);
  const filtered = students.filter(s=> (s.name||'').toLowerCase().includes(q) || (s.roll||'').toLowerCase().includes(q));
  render(filtered);
});

// Clear All
clearAllBtn.addEventListener('click', ()=>{
  if(!confirm('Clear all student records?')) return;
  students = [];
  saveAndRender();
});

// Reset form
resetBtn.addEventListener('click', ()=>{
  delete form.dataset.editIndex;
  form.reset();
  form.querySelector('#addBtn').textContent = 'Add Student';
});

function saveAndRender(){
  localStorage.setItem('students_final', JSON.stringify(students));
  render();
}

// initial
render();
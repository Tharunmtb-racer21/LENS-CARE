// All Records Display

document.addEventListener('DOMContentLoaded', loadAllRecords);

async function loadAllRecords() {
    try {
        const response = await fetch('/api/all-patients');
        const result = await response.json();
        
        if (result.success) {
            displayTable(result.patients);
        } else {
            document.getElementById('tableBody').innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 50px; color: #999;">
                        No records found
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 50px; color: #f44336;">
                    Error loading records: ${error.message}
                </td>
            </tr>
        `;
    }
}

function displayTable(patients) {
    const tbody = document.getElementById('tableBody');
    
    if (patients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 50px; color: #999;">
                    No patient records found. <a href="/register">Register a new patient</a>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    patients.forEach(patient => {
        html += `
            <tr>
                <td>${patient.patient_id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${formatDate(patient.date)}</td>
                <td>${patient.diagnosis}</td>
                <td>
                    <button class="action-btn" onclick="viewPatient('${patient.patient_id}')">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function viewPatient(patientId) {
    window.location.href = `/lookup?id=${patientId}`;
}

function filterTable() {
    const input = document.getElementById('tableSearch');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('recordsTable');
    const tr = table.getElementsByTagName('tr');
    
    for (let i = 1; i < tr.length; i++) {
        let found = false;
        const td = tr[i].getElementsByTagName('td');
        
        for (let j = 0; j < td.length - 1; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        
        tr[i].style.display = found ? '' : 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

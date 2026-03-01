// Patient Lookup

let currentPatientId = '';

async function searchPatient() {
    const patientId = document.getElementById('searchId').value.trim();
    
    if (!patientId) {
        showNotification('Please enter a Patient ID', 'error');
        return;
    }
    
    currentPatientId = patientId;
    
    try {
        const response = await fetch(`/api/get-patient/${patientId}`);
        const result = await response.json();
        
        if (result.success) {
            displayRecords(result.records);
            document.getElementById('searchResults').style.display = 'block';
        } else {
            showNotification(result.message, 'error');
            document.getElementById('searchResults').style.display = 'none';
        }
    } catch (error) {
        showNotification('Error searching patient: ' + error.message, 'error');
    }
}

function displayRecords(records) {
    const container = document.getElementById('recordsContainer');
    
    let html = '';
    
    records.forEach((record, index) => {
        html += `
            <div class="record-card">
                <div class="record-header">
                    <div>
                        <h3>${record.name}</h3>
                        <p style="color: #666;">Patient ID: ${record.patient_id} | Age: ${record.age}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="color: #666; font-size: 14px;">${formatDate(record.date)}</p>
                    </div>
                </div>
                
                <div class="prescription-section">
                    <h4>Prescription Details</h4>
                    <table class="prescription-table">
                        <thead>
                            <tr>
                                <th>Eye</th>
                                <th>SPH</th>
                                <th>CYL</th>
                                <th>AXIS</th>
                                <th>ADD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>OD (Right)</strong></td>
                                <td>${formatNumber(record.od_sph)}</td>
                                <td>${formatNumber(record.od_cyl)}</td>
                                <td>${record.od_axis}°</td>
                                <td>${formatNumber(record.od_add)}</td>
                            </tr>
                            <tr>
                                <td><strong>OS (Left)</strong></td>
                                <td>${formatNumber(record.os_sph)}</td>
                                <td>${formatNumber(record.os_cyl)}</td>
                                <td>${record.os_axis}°</td>
                                <td>${formatNumber(record.os_add)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4>Diagnosis</h4>
                    <p style="padding: 15px; background: #e8f5e9; border-radius: 8px; margin-top: 10px;">
                        ${record.diagnosis}
                    </p>
                </div>
                
                <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <strong>Color Blindness:</strong> ${record.color_blindness || 'Not tested'}
                    </div>
                    <div>
                        <strong>Visual Acuity:</strong> ${record.visual_acuity || 'Not tested'}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function formatNumber(num) {
    const n = parseFloat(num);
    if (n > 0) return '+' + n.toFixed(2);
    return n.toFixed(2);
}

async function downloadPDF() {
    if (!currentPatientId) {
        showNotification('No patient selected', 'error');
        return;
    }
    
    try {
        window.location.href = `/api/generate-pdf/${currentPatientId}`;
        showNotification('PDF download started', 'success');
    } catch (error) {
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Allow Enter key to search
document.getElementById('searchId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPatient();
    }
});

// Registration form handling

document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        patient_id: document.getElementById('patientId').value,
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        od_sph: document.getElementById('odSph').value,
        od_cyl: document.getElementById('odCyl').value,
        od_axis: document.getElementById('odAxis').value,
        od_add: document.getElementById('odAdd').value,
        os_sph: document.getElementById('osSph').value,
        os_cyl: document.getElementById('osCyl').value,
        os_axis: document.getElementById('osAxis').value,
        os_add: document.getElementById('osAdd').value,
        color_blindness_result: document.getElementById('colorBlindness').value,
        visual_acuity_result: document.getElementById('visualAcuity').value
    };
    
    // Validate prescription values
    const odValidation = validatePrescription(
        parseFloat(formData.od_sph),
        parseFloat(formData.od_cyl),
        parseFloat(formData.od_axis),
        parseFloat(formData.od_add)
    );
    
    if (odValidation) {
        showNotification('Right Eye: ' + odValidation, 'error');
        return;
    }
    
    const osValidation = validatePrescription(
        parseFloat(formData.os_sph),
        parseFloat(formData.os_cyl),
        parseFloat(formData.os_axis),
        parseFloat(formData.os_add)
    );
    
    if (osValidation) {
        showNotification('Left Eye: ' + osValidation, 'error');
        return;
    }
    
    // Submit to server
    try {
        const response = await fetch('/api/save-patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show analysis
            displayAnalysis(result.analysis);
            showNotification('Patient record saved successfully!', 'success');
            
            // Scroll to analysis
            document.getElementById('analysisResult').scrollIntoView({ behavior: 'smooth' });
            
            // Reset form after delay
            setTimeout(() => {
                if (confirm('Record saved! Do you want to register another patient?')) {
                    window.location.reload();
                } else {
                    window.location.href = '/';
                }
            }, 2000);
        } else {
            showNotification('Error: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('Error saving record: ' + error.message, 'error');
    }
});

function displayAnalysis(analysis) {
    const analysisDiv = document.getElementById('analysisResult');
    const contentDiv = document.getElementById('analysisContent');
    
    let html = `
        <div class="analysis-section">
            <h4>Diagnosis</h4>
            <p style="font-size: 18px; color: #2c3e50; font-weight: 600;">
                ${analysis.diagnosis}
            </p>
        </div>
        
        <div class="analysis-section" style="margin-top: 20px;">
            <h4>Spherical Equivalent</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                <div style="background: #f0f8ff; padding: 15px; border-radius: 8px;">
                    <strong>Right Eye (OD):</strong> ${analysis.od_se > 0 ? '+' : ''}${analysis.od_se}D
                </div>
                <div style="background: #fff0f0; padding: 15px; border-radius: 8px;">
                    <strong>Left Eye (OS):</strong> ${analysis.os_se > 0 ? '+' : ''}${analysis.os_se}D
                </div>
            </div>
        </div>
    `;
    
    if (analysis.recommendations && analysis.recommendations.length > 0) {
        html += `
            <div class="analysis-section" style="margin-top: 20px;">
                <h4>Recommendations</h4>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    contentDiv.innerHTML = html;
    analysisDiv.style.display = 'block';
}

// Quick validation on input
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.value) {
            this.style.borderColor = '#4caf50';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
});

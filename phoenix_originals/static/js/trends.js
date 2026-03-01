// Prescription Trends Visualization

let trendsChart = null;

async function viewTrends() {
    const patientId = document.getElementById('trendSearchId').value.trim();
    
    if (!patientId) {
        showNotification('Please enter a Patient ID', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/patient-trends/${patientId}`);
        const result = await response.json();
        
        if (result.success) {
            if (result.records.length < 2) {
                showNotification(result.message || 'Need at least 2 records for trend analysis', 'warning');
                return;
            }
            
            displayTrends(result.records, result.analysis);
            document.getElementById('trendsResults').style.display = 'block';
        } else {
            showNotification(result.message, 'error');
            document.getElementById('trendsResults').style.display = 'none';
        }
    } catch (error) {
        showNotification('Error loading trends: ' + error.message, 'error');
    }
}

function displayTrends(records, analysis) {
    // Prepare data for chart
    const dates = records.map(r => r.date);
    const odValues = records.map(r => r.od_se);
    const osValues = records.map(r => r.os_se);
    
    // Destroy existing chart if it exists
    if (trendsChart) {
        trendsChart.destroy();
    }
    
    // Create new chart
    const ctx = document.getElementById('trendsChart').getContext('2d');
    
    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Right Eye (OD)',
                    data: odValues,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Left Eye (OS)',
                    data: osValues,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Spherical Equivalent Progression',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + 'D';
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Spherical Equivalent (Diopters)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return (value > 0 ? '+' : '') + value.toFixed(1) + 'D';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Visit Date',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
    
    // Display analysis
    displayAnalysis(records, analysis);
}

function displayAnalysis(records, analysis) {
    const analysisDiv = document.getElementById('trendsAnalysis');
    
    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];
    
    let html = `
        <h3>Progression Analysis</h3>
        <div class="analysis-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; border-left: 4px solid #2196F3;">
                <h4 style="color: #1976D2; margin-bottom: 10px;">Right Eye (OD)</h4>
                <p><strong>Initial:</strong> ${formatSE(firstRecord.od_se)}</p>
                <p><strong>Current:</strong> ${formatSE(lastRecord.od_se)}</p>
                <p><strong>Change:</strong> <span style="font-weight: bold; color: ${analysis.od_change < 0 ? '#f44336' : '#4caf50'};">
                    ${analysis.od_change > 0 ? '+' : ''}${analysis.od_change}D
                </span></p>
            </div>
            
            <div style="background: #fce4ec; padding: 20px; border-radius: 10px; border-left: 4px solid #E91E63;">
                <h4 style="color: #C2185B; margin-bottom: 10px;">Left Eye (OS)</h4>
                <p><strong>Initial:</strong> ${formatSE(firstRecord.os_se)}</p>
                <p><strong>Current:</strong> ${formatSE(lastRecord.os_se)}</p>
                <p><strong>Change:</strong> <span style="font-weight: bold; color: ${analysis.os_change < 0 ? '#f44336' : '#4caf50'};">
                    ${analysis.os_change > 0 ? '+' : ''}${analysis.os_change}D
                </span></p>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 20px; background: #f5f7fa; border-radius: 10px;">
            <h4>Summary</h4>
            <p><strong>Number of visits:</strong> ${analysis.visits}</p>
            <p><strong>First visit:</strong> ${firstRecord.date}</p>
            <p><strong>Latest visit:</strong> ${lastRecord.date}</p>
        </div>
    `;
    
    // Add alerts based on analysis
    if (analysis.alert) {
        html += `
            <div class="alert alert-warning" style="margin-top: 20px;">
                <h4>⚠️ Alert</h4>
                <p>${analysis.alert}</p>
                <p><strong>Recommendation:</strong> Consider more frequent monitoring and discuss myopia control strategies with your eye care professional.</p>
            </div>
        `;
    } else if (analysis.status) {
        html += `
            <div class="alert alert-success" style="margin-top: 20px;">
                <h4>✓ Status</h4>
                <p>${analysis.status}</p>
            </div>
        `;
    }
    
    // Detailed prescription history
    html += `
        <div style="margin-top: 30px;">
            <h4>Detailed Prescription History</h4>
            <table class="data-table" style="margin-top: 15px;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>OD SPH</th>
                        <th>OD CYL</th>
                        <th>OS SPH</th>
                        <th>OS CYL</th>
                        <th>OD SE</th>
                        <th>OS SE</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    records.forEach(record => {
        html += `
            <tr>
                <td>${record.date}</td>
                <td>${formatNumber(record.od_sph)}</td>
                <td>${formatNumber(record.od_cyl)}</td>
                <td>${formatNumber(record.os_sph)}</td>
                <td>${formatNumber(record.os_cyl)}</td>
                <td style="font-weight: bold;">${formatSE(record.od_se)}</td>
                <td style="font-weight: bold;">${formatSE(record.os_se)}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    analysisDiv.innerHTML = html;
}

function formatNumber(num) {
    const n = parseFloat(num);
    if (n > 0) return '+' + n.toFixed(2);
    return n.toFixed(2);
}

function formatSE(se) {
    const n = parseFloat(se);
    if (n > 0) return '+' + n.toFixed(2) + 'D';
    return n.toFixed(2) + 'D';
}

// Allow Enter key to search
document.getElementById('trendSearchId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        viewTrends();
    }
});

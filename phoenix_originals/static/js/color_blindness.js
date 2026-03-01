// Color Blindness Test - Ishihara-style test

const tests = [
    { number: 12, colors: { bg: '#e8a799', fg: '#7fc97f' }, type: 'normal' },
    { number: 8, colors: { bg: '#fdb863', fg: '#5e3c99' }, type: 'normal' },
    { number: 6, colors: { bg: '#fee08b', fg: '#3288bd' }, type: 'normal' },
    { number: 29, colors: { bg: '#fc8d59', fg: '#91bfdb' }, type: 'deuteranopia' },
    { number: 5, colors: { bg: '#d7191c', fg: '#abdda4' }, type: 'protanopia' },
    { number: 3, colors: { bg: '#f46d43', fg: '#66c2a5' }, type: 'normal' },
    { number: 15, colors: { bg: '#fee090', fg: '#4575b4' }, type: 'normal' },
    { number: 74, colors: { bg: '#fdae61', fg: '#9e0142' }, type: 'deuteranopia' },
    { number: 2, colors: { bg: '#d53e4f', fg: '#e6f598' }, type: 'protanopia' },
    { number: 45, colors: { bg: '#fee08b', fg: '#f46d43' }, type: 'normal' }
];

let currentTestIndex = 0;
let answers = [];
let correctAnswers = 0;

function startTest() {
    document.getElementById('testInstructions').style.display = 'none';
    document.getElementById('testContent').style.display = 'block';
    document.getElementById('totalQuestions').textContent = tests.length;
    showTest();
}

function showTest() {
    if (currentTestIndex >= tests.length) {
        showResults();
        return;
    }
    
    const test = tests[currentTestIndex];
    document.getElementById('currentQuestion').textContent = currentTestIndex + 1;
    
    // Generate Ishihara-style plate
    const canvas = document.getElementById('testPlate');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);
    
    // Draw background circles
    drawIsihharaCircles(ctx, test.colors.bg, test.colors.fg, test.number);
    
    // Clear and focus answer input
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
}

function drawIsihharaCircles(ctx, bgColor, fgColor, number) {
    const centerX = 200;
    const centerY = 200;
    const radius = 180;
    
    // Draw background circles
    for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const size = 5 + Math.random() * 10;
        
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw number with foreground color
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create number shape with circles
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.font = 'bold 120px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(number, 200, 200);
    
    const imageData = tempCtx.getImageData(0, 0, 400, 400);
    
    // Draw circles where number is
    for (let y = 0; y < 400; y += 8) {
        for (let x = 0; x < 400; x += 8) {
            const index = (y * 400 + x) * 4;
            if (imageData.data[index + 3] > 128) {
                const size = 4 + Math.random() * 8;
                ctx.fillStyle = fgColor;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function submitAnswer() {
    const answer = document.getElementById('answerInput').value.trim();
    const correctAnswer = tests[currentTestIndex].number.toString();
    
    answers.push({
        question: currentTestIndex + 1,
        correct: correctAnswer,
        given: answer || '0',
        isCorrect: answer === correctAnswer
    });
    
    if (answer === correctAnswer) {
        correctAnswers++;
    }
    
    currentTestIndex++;
    showTest();
}

// Allow Enter key to submit
document.getElementById('answerInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitAnswer();
    }
});

function showResults() {
    document.getElementById('testContent').style.display = 'none';
    document.getElementById('testResults').style.display = 'block';
    
    const percentage = (correctAnswers / tests.length) * 100;
    document.getElementById('scoreDisplay').textContent = `${correctAnswers} / ${tests.length} (${percentage.toFixed(0)}%)`;
    
    let analysis = '';
    let resultType = 'Normal Color Vision';
    
    if (percentage >= 90) {
        analysis = `
            <div class="alert alert-success">
                <h4>✓ Normal Color Vision</h4>
                <p>Your results indicate normal color vision. You correctly identified ${correctAnswers} out of ${tests.length} plates.</p>
            </div>
        `;
        resultType = 'Normal';
    } else if (percentage >= 70) {
        analysis = `
            <div class="alert alert-warning">
                <h4>⚠️ Possible Mild Color Vision Deficiency</h4>
                <p>Your results suggest a possible mild color vision deficiency. You correctly identified ${correctAnswers} out of ${tests.length} plates.</p>
                <p><strong>Recommendation:</strong> Consider consulting with an eye care professional for a comprehensive examination.</p>
            </div>
        `;
        resultType = 'Possible Deficiency';
    } else {
        // Analyze which type of deficiency
        let deuteranopiaErrors = 0;
        let protanopiaErrors = 0;
        
        answers.forEach((ans, idx) => {
            if (!ans.isCorrect) {
                if (tests[idx].type === 'deuteranopia') deuteranopiaErrors++;
                if (tests[idx].type === 'protanopia') protanopiaErrors++;
            }
        });
        
        let deficiencyType = 'Color Vision Deficiency';
        if (deuteranopiaErrors > protanopiaErrors) {
            deficiencyType = 'Possible Deuteranopia (Red-Green)';
        } else if (protanopiaErrors > deuteranopiaErrors) {
            deficiencyType = 'Possible Protanopia (Red)';
        }
        
        analysis = `
            <div class="alert alert-error">
                <h4>⚠️ ${deficiencyType}</h4>
                <p>Your results indicate a possible color vision deficiency. You correctly identified ${correctAnswers} out of ${tests.length} plates.</p>
                <p><strong>Important:</strong> This is a screening test only. Please consult with an eye care professional for a proper diagnosis.</p>
            </div>
        `;
        resultType = deficiencyType;
    }
    
    // Add detailed results
    analysis += `
        <h4 style="margin-top: 30px;">Detailed Results</h4>
        <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <thead>
                <tr style="background: #f5f7fa;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Question</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Correct Answer</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Your Answer</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Result</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    answers.forEach(ans => {
        const resultIcon = ans.isCorrect ? '✓' : '✗';
        const resultColor = ans.isCorrect ? '#4caf50' : '#f44336';
        analysis += `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${ans.question}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${ans.correct}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${ans.given}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: ${resultColor}; font-weight: bold;">${resultIcon}</td>
            </tr>
        `;
    });
    
    analysis += `
            </tbody>
        </table>
    `;
    
    document.getElementById('resultAnalysis').innerHTML = analysis;
    
    // Store result in session storage for use in registration
    sessionStorage.setItem('colorBlindnessResult', resultType);
}

function restartTest() {
    currentTestIndex = 0;
    answers = [];
    correctAnswers = 0;
    document.getElementById('testResults').style.display = 'none';
    document.getElementById('testInstructions').style.display = 'block';
}

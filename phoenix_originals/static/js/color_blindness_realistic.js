// Realistic Ishihara Color Blindness Test
// 10 plates with authentic color patterns

const tests = [
    // Plate 1: Easy test plate (everyone should see 12)
    {
        number: 12,
        patterns: [
            { colors: ['#E88873', '#EA9E8D', '#F0A898', '#E67C66'], weight: 45 }, // Orange background
            { colors: ['#739F5D', '#8FB574', '#A4C798', '#5E8F4A'], weight: 55 }  // Green foreground
        ],
        type: 'control',
        description: 'Control plate - everyone should see 12'
    },
    
    // Plate 2: Red-green deficiency test
    {
        number: 8,
        patterns: [
            { colors: ['#E6A85C', '#F4C083', '#FCDA9A', '#D99648'], weight: 48 }, // Yellow-orange background
            { colors: ['#6F5F9E', '#8976B8', '#A18FCC', '#5A4B85'], weight: 52 }  // Purple foreground
        ],
        type: 'protanopia',
        description: 'Protanopia test - people with red-green deficiency may see 3'
    },
    
    // Plate 3: Standard test
    {
        number: 6,
        patterns: [
            { colors: ['#F7E59C', '#FFF1B8', '#FFFAD0', '#EDD780'], weight: 46 }, // Light yellow background
            { colors: ['#4A90C8', '#6BA8D8', '#8BBEE8', '#2F78B0'], weight: 54 }  // Blue foreground
        ],
        type: 'normal',
        description: 'Normal vision test'
    },
    
    // Plate 4: Deuteranopia test
    {
        number: 29,
        patterns: [
            { colors: ['#FC9D6B', '#FFB58A', '#FFC8A2', '#E88654'], weight: 44 }, // Orange background
            { colors: ['#A3D4EA', '#BADDEE', '#D1E6F3', '#8AC5DD'], weight: 56 }  // Light blue foreground
        ],
        type: 'deuteranopia',
        description: 'Deuteranopia test - may see 70 instead of 29'
    },
    
    // Plate 5: Protanopia severe test
    {
        number: 5,
        patterns: [
            { colors: ['#D95B5B', '#E77373', '#F58B8B', '#C74343'], weight: 47 }, // Red background
            { colors: ['#B4DDB4', '#C8E6C8', '#DCF0DC', '#A0D4A0'], weight: 53 }  // Light green foreground
        ],
        type: 'protanopia',
        description: 'Protanopia test - may not see number'
    },
    
    // Plate 6: Mixed pattern
    {
        number: 3,
        patterns: [
            { colors: ['#F57C5A', '#FF9473', '#FFAC8C', '#E36442'], weight: 45 }, // Red-orange background
            { colors: ['#73C2A5', '#8DD4B8', '#A7E6CB', '#5EB092'], weight: 55 }  // Teal foreground
        ],
        type: 'normal',
        description: 'Normal vision test'
    },
    
    // Plate 7: Yellow-blue pattern
    {
        number: 15,
        patterns: [
            { colors: ['#FFE8A3', '#FFF0BB', '#FFF8D3', '#F5DC8B'], weight: 46 }, // Yellow background
            { colors: ['#5D8CC7', '#76A2D6', '#8FB8E5', '#4476B5'], weight: 54 }  // Blue foreground
        ],
        type: 'normal',
        description: 'Normal vision - clear number'
    },
    
    // Plate 8: Deuteranopia advanced
    {
        number: 74,
        patterns: [
            { colors: ['#FDAF6B', '#FFC083', '#FFD19B', '#EA9E53'], weight: 43 }, // Orange background
            { colors: ['#A73C50', '#BF5567', '#D76D7E', '#8F2438'], weight: 57 }  // Dark red foreground
        ],
        type: 'deuteranopia',
        description: 'Deuteranopia test - may see 21'
    },
    
    // Plate 9: Protanopia advanced
    {
        number: 2,
        patterns: [
            { colors: ['#DD5959', '#ED7070', '#FD8787', '#CB4141'], weight: 48 }, // Red background
            { colors: ['#E9F79E', '#F1FCB8', '#F9FFD0', '#E1F286'], weight: 52 }  // Yellow-green foreground
        ],
        type: 'protanopia',
        description: 'Protanopia severe test'
    },
    
    // Plate 10: Final test
    {
        number: 45,
        patterns: [
            { colors: ['#F7E8A0', '#FFF1B8', '#FFFAD0', '#EFDC88'], weight: 45 }, // Yellow background
            { colors: ['#F57C5A', '#FF9473', '#FFAC8C', '#E36442'], weight: 55 }  // Orange foreground
        ],
        type: 'normal',
        description: 'Normal vision test'
    }
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
    
    // Generate realistic Ishihara-style plate
    const canvas = document.getElementById('testPlate');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);
    
    // Draw realistic Ishihara plate
    drawRealisticIshihara(ctx, test.patterns, test.number);
    
    // Clear and focus answer input
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
}

function drawRealisticIshihara(ctx, patterns, number) {
    const centerX = 200;
    const centerY = 200;
    const radius = 180;
    
    // Step 1: Draw diverse background dots
    const backgroundPattern = patterns[0];
    const numBackgroundDots = 400;
    
    for (let i = 0; i < numBackgroundDots; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Varying dot sizes for realism (Ishihara plates have different sized dots)
        const sizeCategory = Math.random();
        let dotSize;
        if (sizeCategory < 0.3) {
            dotSize = 3 + Math.random() * 4; // Small dots
        } else if (sizeCategory < 0.7) {
            dotSize = 6 + Math.random() * 6; // Medium dots
        } else {
            dotSize = 10 + Math.random() * 8; // Large dots
        }
        
        // Select random color from background palette
        const colorIndex = Math.floor(Math.random() * backgroundPattern.colors.length);
        ctx.fillStyle = backgroundPattern.colors[colorIndex];
        
        // Add slight color variation for realism
        const variation = (Math.random() - 0.5) * 20;
        ctx.globalAlpha = 0.85 + Math.random() * 0.15;
        
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
    
    // Step 2: Create number mask
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw number with bold font
    tempCtx.font = 'bold 140px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillStyle = '#000000';
    tempCtx.fillText(number, 200, 200);
    
    const imageData = tempCtx.getImageData(0, 0, 400, 400);
    
    // Step 3: Draw foreground dots where number is
    const foregroundPattern = patterns[1];
    
    // Create a denser grid for number area
    for (let y = 0; y < 400; y += 4) {
        for (let x = 0; x < 400; x += 4) {
            const index = (y * 400 + x) * 4;
            const alpha = imageData.data[index + 3];
            
            if (alpha > 128) {
                // Random chance to place a dot (not every pixel)
                if (Math.random() < 0.6) {
                    // Varying dot sizes
                    const sizeCategory = Math.random();
                    let dotSize;
                    if (sizeCategory < 0.3) {
                        dotSize = 3 + Math.random() * 4;
                    } else if (sizeCategory < 0.7) {
                        dotSize = 5 + Math.random() * 5;
                    } else {
                        dotSize = 8 + Math.random() * 7;
                    }
                    
                    // Add slight position jitter
                    const jitterX = x + (Math.random() - 0.5) * 8;
                    const jitterY = y + (Math.random() - 0.5) * 8;
                    
                    // Select random color from foreground palette
                    const colorIndex = Math.floor(Math.random() * foregroundPattern.colors.length);
                    ctx.fillStyle = foregroundPattern.colors[colorIndex];
                    
                    ctx.globalAlpha = 0.85 + Math.random() * 0.15;
                    
                    ctx.beginPath();
                    ctx.arc(jitterX, jitterY, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
    
    ctx.globalAlpha = 1.0;
    
    // Step 4: Add more random background dots for overlap effect
    const overlapDots = 100;
    for (let i = 0; i < overlapDots; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const dotSize = 4 + Math.random() * 6;
        const colorIndex = Math.floor(Math.random() * backgroundPattern.colors.length);
        ctx.fillStyle = backgroundPattern.colors[colorIndex];
        ctx.globalAlpha = 0.7 + Math.random() * 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
}

function submitAnswer() {
    const test = tests[currentTestIndex];
    const userAnswer = document.getElementById('answerInput').value.trim();
    
    const isCorrect = userAnswer === test.number.toString();
    
    answers.push({
        plate: currentTestIndex + 1,
        expected: test.number,
        userAnswer: userAnswer,
        correct: isCorrect,
        type: test.type
    });
    
    if (isCorrect) {
        correctAnswers++;
    }
    
    currentTestIndex++;
    showTest();
}

function skipQuestion() {
    const test = tests[currentTestIndex];
    
    answers.push({
        plate: currentTestIndex + 1,
        expected: test.number,
        userAnswer: 'Skipped',
        correct: false,
        type: test.type
    });
    
    currentTestIndex++;
    showTest();
}

function showResults() {
    document.getElementById('testContent').style.display = 'none';
    document.getElementById('testResults').style.display = 'block';
    
    const percentage = Math.round((correctAnswers / tests.length) * 100);
    document.getElementById('scorePercentage').textContent = `${percentage}%`;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('totalCount').textContent = tests.length;
    
    // Determine result type
    let resultText = '';
    let resultClass = '';
    
    if (percentage >= 90) {
        resultText = 'Normal Color Vision';
        resultClass = 'result-normal';
    } else if (percentage >= 70) {
        resultText = 'Mild Color Vision Deficiency';
        resultClass = 'result-mild';
    } else if (percentage >= 50) {
        resultText = 'Moderate Color Vision Deficiency';
        resultClass = 'result-moderate';
    } else {
        resultText = 'Significant Color Vision Deficiency';
        resultClass = 'result-severe';
    }
    
    document.getElementById('resultType').textContent = resultText;
    document.getElementById('resultType').className = resultClass;
    
    // Analysis
    const protanopiaErrors = answers.filter(a => a.type === 'protanopia' && !a.correct).length;
    const deuteranopiaErrors = answers.filter(a => a.type === 'deuteranopia' && !a.correct).length;
    
    let analysis = '';
    if (protanopiaErrors > deuteranopiaErrors && protanopiaErrors >= 2) {
        analysis = 'Your test results suggest possible Protanopia (red-green color blindness, red-weak). ';
    } else if (deuteranopiaErrors > protanopiaErrors && deuteranopiaErrors >= 2) {
        analysis = 'Your test results suggest possible Deuteranopia (red-green color blindness, green-weak). ';
    } else if (percentage < 90) {
        analysis = 'Your test results suggest some difficulty with color discrimination. ';
    } else {
        analysis = 'Your test results indicate normal color vision. ';
    }
    
    analysis += 'For a professional diagnosis, please consult an eye care specialist.';
    
    document.getElementById('analysisText').textContent = analysis;
    
    // Show detailed answers
    const detailsHtml = answers.map(a => `
        <div class="answer-row ${a.correct ? 'correct' : 'incorrect'}">
            <span class="plate-num">Plate ${a.plate}</span>
            <span class="expected">Expected: ${a.expected}</span>
            <span class="user-ans">Your Answer: ${a.userAnswer}</span>
            <span class="status">${a.correct ? '✓' : '✗'}</span>
        </div>
    `).join('');
    
    document.getElementById('detailedAnswers').innerHTML = detailsHtml;
}

function restartTest() {
    currentTestIndex = 0;
    answers = [];
    correctAnswers = 0;
    
    document.getElementById('testResults').style.display = 'none';
    document.getElementById('testInstructions').style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startTestBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    const submitBtn = document.getElementById('submitAnswer');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAnswer);
    }
    
    const skipBtn = document.getElementById('skipQuestion');
    if (skipBtn) {
        skipBtn.addEventListener('click', skipQuestion);
    }
    
    const restartBtn = document.getElementById('restartTest');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartTest);
    }
    
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });
    }
});

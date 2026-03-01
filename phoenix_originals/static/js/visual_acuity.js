// Visual Acuity Test - Snellen Chart Style

const acuityLevels = [
    { level: 1, fontSize: 200, acuity: '20/200', label: 'Large' },
    { level: 2, fontSize: 150, acuity: '20/100', label: 'Very Large' },
    { level: 3, fontSize: 100, acuity: '20/70', label: 'Large' },
    { level: 4, fontSize: 70, acuity: '20/50', label: 'Medium-Large' },
    { level: 5, fontSize: 50, acuity: '20/40', label: 'Medium' },
    { level: 6, fontSize: 35, acuity: '20/30', label: 'Small' },
    { level: 7, fontSize: 25, acuity: '20/25', label: 'Very Small' },
    { level: 8, fontSize: 20, acuity: '20/20', label: 'Normal' }
];

const directions = ['up', 'down', 'left', 'right'];
let currentLevel = 0;
let correctCount = 0;
let totalAttempts = 0;
let currentDirection = '';

function startAcuityTest() {
    document.getElementById('testInstructions').style.display = 'none';
    document.getElementById('testContent').style.display = 'block';
    showAcuityTest();
}

function showAcuityTest() {
    if (currentLevel >= acuityLevels.length) {
        showAcuityResults();
        return;
    }
    
    const level = acuityLevels[currentLevel];
    document.getElementById('currentLevel').textContent = currentLevel + 1;
    document.getElementById('acuityLevel').textContent = `(${level.acuity} - ${level.label})`;
    
    // Show random direction
    currentDirection = directions[Math.floor(Math.random() * directions.length)];
    showLetter(currentDirection, level.fontSize);
}

function showLetter(direction, fontSize) {
    const letterDiv = document.getElementById('testLetter');
    letterDiv.style.fontSize = fontSize + 'px';
    
    // Rotate E based on direction
    let rotation = 0;
    switch(direction) {
        case 'up': rotation = -90; break;
        case 'down': rotation = 90; break;
        case 'left': rotation = 180; break;
        case 'right': rotation = 0; break;
    }
    
    letterDiv.style.transform = `rotate(${rotation}deg)`;
    letterDiv.textContent = 'E';
}

function checkAnswer(answer) {
    totalAttempts++;
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.direction-btn');
    
    // Reset buttons
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });
    
    if (answer === currentDirection) {
        correctCount++;
        feedback.textContent = '✓ Correct!';
        feedback.style.color = '#4caf50';
        
        // Highlight correct button
        event.target.classList.add('correct');
        
        // Move to next level after delay
        setTimeout(() => {
            currentLevel++;
            feedback.textContent = '';
            showAcuityTest();
        }, 1000);
    } else {
        feedback.textContent = '✗ Incorrect. Try again or it will move to the next level.';
        feedback.style.color = '#f44336';
        
        // Highlight wrong button
        event.target.classList.add('wrong');
        
        // Move to next level after 2 attempts at this level
        if (totalAttempts % 2 === 0) {
            setTimeout(() => {
                currentLevel++;
                feedback.textContent = '';
                showAcuityTest();
            }, 1500);
        }
    }
}

function showAcuityResults() {
    document.getElementById('testContent').style.display = 'none';
    document.getElementById('testResults').style.display = 'block';
    
    // Calculate visual acuity based on performance
    let finalAcuity = '20/200';
    let analysis = '';
    
    const accuracyRate = (correctCount / acuityLevels.length) * 100;
    
    if (correctCount >= 7) {
        finalAcuity = '20/20';
        analysis = `
            <div class="alert alert-success">
                <h4>✓ Excellent Vision</h4>
                <p>Your visual acuity test indicates excellent vision at 20/20 or better. You correctly identified ${correctCount} out of ${acuityLevels.length} levels.</p>
                <p>20/20 vision means you can see clearly at 20 feet what should normally be seen at 20 feet.</p>
            </div>
        `;
    } else if (correctCount >= 6) {
        finalAcuity = '20/25';
        analysis = `
            <div class="alert alert-success">
                <h4>✓ Very Good Vision</h4>
                <p>Your visual acuity is approximately 20/25. You correctly identified ${correctCount} out of ${acuityLevels.length} levels.</p>
                <p>This is considered very good vision and is acceptable for most activities including driving.</p>
            </div>
        `;
    } else if (correctCount >= 5) {
        finalAcuity = '20/30';
        analysis = `
            <div class="alert alert-success">
                <h4>Good Vision</h4>
                <p>Your visual acuity is approximately 20/30. You correctly identified ${correctCount} out of ${acuityLevels.length} levels.</p>
                <p>This is still considered good vision for most daily activities.</p>
            </div>
        `;
    } else if (correctCount >= 4) {
        finalAcuity = '20/40';
        analysis = `
            <div class="alert alert-warning">
                <h4>Fair Vision</h4>
                <p>Your visual acuity is approximately 20/40. You correctly identified ${correctCount} out of ${acuityLevels.length} levels.</p>
                <p><strong>Note:</strong> In many places, 20/40 or better vision is required for an unrestricted driver's license.</p>
                <p><strong>Recommendation:</strong> Consider getting a comprehensive eye examination.</p>
            </div>
        `;
    } else if (correctCount >= 3) {
        finalAcuity = '20/70';
        analysis = `
            <div class="alert alert-warning">
                <h4>⚠️ Below Normal Vision</h4>
                <p>Your visual acuity test indicates vision of approximately 20/70. You correctly identified ${correctCount} out of ${acuityLevels.length} levels.</p>
                <p><strong>Important:</strong> This level of vision may require corrective lenses.</p>
                <p><strong>Recommendation:</strong> Please schedule an eye examination with an optometrist or ophthalmologist.</p>
            </div>
        `;
    } else {
        finalAcuity = '20/100 or worse';
        analysis = `
            <div class="alert alert-error">
                <h4>⚠️ Significant Vision Impairment</h4>
                <p>Your visual acuity test indicates significant vision impairment. You correctly identified only ${correctCount} out of ${acuityLevels.length} levels.</p>
                <p><strong>Important:</strong> This result suggests you may need corrective lenses or have an underlying eye condition.</p>
                <p><strong>Recommendation:</strong> Please consult with an eye care professional as soon as possible.</p>
            </div>
        `;
    }
    
    analysis += `
        <h4 style="margin-top: 30px;">Understanding Your Results</h4>
        <div style="background: #f5f7fa; padding: 20px; border-radius: 10px; margin-top: 15px;">
            <p><strong>What does ${finalAcuity} mean?</strong></p>
            <p>If you have ${finalAcuity} vision, it means that you must be as close as 20 feet to see what a person with normal vision can see at ${finalAcuity.split('/')[1]} feet.</p>
            
            <p style="margin-top: 15px;"><strong>Accuracy Rate:</strong> ${accuracyRate.toFixed(0)}%</p>
            <p><strong>Levels Passed:</strong> ${correctCount} / ${acuityLevels.length}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 15px; border-left: 4px solid #ffc107;">
            <p><strong>⚠️ Important Disclaimer:</strong></p>
            <p>This is a screening test and should not be used as a substitute for a comprehensive eye examination by a qualified eye care professional. Many factors can affect the accuracy of this test, including screen size, viewing distance, and ambient lighting.</p>
        </div>
    `;
    
    document.getElementById('finalAcuity').textContent = finalAcuity;
    document.getElementById('resultAnalysis').innerHTML = analysis;
    
    // Store result in session storage
    sessionStorage.setItem('visualAcuityResult', finalAcuity);
}

function restartAcuityTest() {
    currentLevel = 0;
    correctCount = 0;
    totalAttempts = 0;
    document.getElementById('testResults').style.display = 'none';
    document.getElementById('testInstructions').style.display = 'block';
}

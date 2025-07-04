// Start Self Typing Developer
const TxtType = function(el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 1) || 750;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};

// TxtType.prototype.tick = function() {
// 	var i = this.loopNum % this.toRotate.length;
// 	var fullTxt = this.toRotate[i];

// 	if (this.isDeleting) {
// 	this.txt = fullTxt.substring(0, this.txt.length - 1);
// 	} else {
// 	this.txt = fullTxt.substring(0, this.txt.length + 1);
// 	}

// 	this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

// 	var that = this;
// 	var delta = 200 - Math.random() * 100;

// 	if (this.isDeleting) { delta /= 2; }

// 	if (!this.isDeleting && this.txt === fullTxt) {
// 	delta = this.period;
// 	this.isDeleting = true;
// 	} else if (this.isDeleting && this.txt === '') {
// 	this.isDeleting = false;
// 	this.loopNum++;
// 	delta = 500;
// 	}

// 	setTimeout(function() {
// 	that.tick();
// 	}, delta);
// };

TxtType.prototype.tick = function() {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
	this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
	this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

	var that = this;
	var delta = 100 - Math.random() * 50;

	if (this.isDeleting) { delta /= 2; }

	if (!this.isDeleting && this.txt === fullTxt) {
	delta = this.period;
	this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
	this.isDeleting = false;
	this.loopNum++;
	delta = 250;
	}

	setTimeout(function() {
	that.tick();
	}, delta);
};

window.onload = function() {
	var elements = document.getElementsByClassName('typewrite');
	for (var i=0; i<elements.length; i++) {
		var toRotate = elements[i].getAttribute('data-type');
		var period = elements[i].getAttribute('data-period');
		if (toRotate) {
		  new TxtType(elements[i], JSON.parse(toRotate), period);
		}
	}
	// INJECT CSS
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
	document.body.appendChild(css);
};
//End Self Typing Developer

// Chain-of-Thought Model Demo Function
function showCotDemo() {
    // Create a modal-like experience showcasing the chain-of-thought process
    const modalHTML = `
        <div id="cotDemoModal" class="cot-modal-overlay">
            <div class="cot-modal-content">
                <div class="cot-modal-header">
                    <h2>Chain-of-Thought Model Demo</h2>
                    <span class="cot-modal-close" onclick="closeCotDemo()">&times;</span>
                </div>
                <div class="cot-modal-body">
                    <div class="demo-example">
                        <h3>Example Problem: "What's 15% of 240?"</h3>
                        <div class="reasoning-steps">
                            <div class="step-demo" id="step1">
                                <div class="step-header">
                                    <span class="step-icon">🔍</span>
                                    <strong>Step 1: Problem Analysis</strong>
                                </div>
                                <p class="step-content">I need to calculate 15% of 240. This is a percentage calculation.</p>
                            </div>
                            
                            <div class="step-demo" id="step2" style="display: none;">
                                <div class="step-header">
                                    <span class="step-icon">🧮</span>
                                    <strong>Step 2: Method Selection</strong>
                                </div>
                                <p class="step-content">15% = 15/100 = 0.15, so I need to multiply 240 × 0.15</p>
                            </div>
                            
                            <div class="step-demo" id="step3" style="display: none;">
                                <div class="step-header">
                                    <span class="step-icon">⚡</span>
                                    <strong>Step 3: Calculation</strong>
                                </div>
                                <p class="step-content">240 × 0.15 = 240 × (10 + 5)/100 = 24 + 12 = 36</p>
                            </div>
                            
                            <div class="step-demo" id="step4" style="display: none;">
                                <div class="step-header">
                                    <span class="step-icon">✅</span>
                                    <strong>Step 4: Verification</strong>
                                </div>
                                <p class="step-content">36 ÷ 240 = 0.15 = 15% ✓</p>
                            </div>
                        </div>
                        
                        <div class="final-answer" id="finalAnswer" style="display: none;">
                            <h4>Final Answer: 36</h4>
                            <p>The model showed its reasoning step-by-step, making the solution transparent and verifiable.</p>
                        </div>
                        
                        <div class="demo-controls">
                            <button class="demo-step-btn" onclick="nextStep()">Show Next Step</button>
                            <button class="demo-reset-btn" onclick="resetDemo()" style="display: none;">Reset Demo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        .cot-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .cot-modal-content {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 20px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .cot-modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .cot-modal-header h2 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        
        .cot-modal-close {
            color: white;
            font-size: 30px;
            cursor: pointer;
            line-height: 1;
        }
        
        .cot-modal-close:hover {
            opacity: 0.7;
        }
        
        .cot-modal-body {
            padding: 30px;
            color: white;
        }
        
        .demo-example h3 {
            color: #4fc3f7;
            margin-bottom: 30px;
            text-align: center;
            font-size: 20px;
        }
        
        .step-demo {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin: 15px 0;
            border-left: 4px solid #4fc3f7;
            animation: fadeInUp 0.5s ease;
        }
        
        .step-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .step-icon {
            font-size: 20px;
            margin-right: 10px;
        }
        
        .step-content {
            margin: 0;
            line-height: 1.6;
            font-size: 16px;
        }
        
        .final-answer {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            margin: 20px 0;
            animation: fadeInUp 0.5s ease;
        }
        
        .final-answer h4 {
            margin: 0 0 10px;
            font-size: 22px;
        }
        
        .demo-controls {
            text-align: center;
            margin-top: 30px;
        }
        
        .demo-step-btn, .demo-reset-btn {
            background: linear-gradient(45deg, #ff6b6b, #ffa500);
            border: none;
            border-radius: 25px;
            padding: 12px 25px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            margin: 0 10px;
            transition: all 0.3s ease;
        }
        
        .demo-step-btn:hover, .demo-reset-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .cot-modal-content { margin: 10px; }
            .cot-modal-header, .cot-modal-body { padding: 20px; }
            .demo-step-btn, .demo-reset-btn { padding: 10px 20px; font-size: 14px; }
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Initialize demo state
    window.currentDemoStep = 1;
}

function nextStep() {
    if (window.currentDemoStep <= 4) {
        document.getElementById(`step${window.currentDemoStep}`).style.display = 'block';
        window.currentDemoStep++;
        
        if (window.currentDemoStep > 4) {
            document.getElementById('finalAnswer').style.display = 'block';
            document.querySelector('.demo-step-btn').style.display = 'none';
            document.querySelector('.demo-reset-btn').style.display = 'inline-block';
        }
    }
}

function resetDemo() {
    // Hide all steps and final answer
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}`).style.display = 'none';
    }
    document.getElementById('finalAnswer').style.display = 'none';
    
    // Reset buttons
    document.querySelector('.demo-step-btn').style.display = 'inline-block';
    document.querySelector('.demo-reset-btn').style.display = 'none';
    
    // Reset step counter
    window.currentDemoStep = 1;
}

function closeCotDemo() {
    const modal = document.getElementById('cotDemoModal');
    if (modal) {
        modal.remove();
    }
}

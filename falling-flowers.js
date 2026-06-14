(function() {
    // Inject CSS for the falling flowers
    const style = document.createElement('style');
    style.innerHTML = `
        #flower-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0; /* Keep it behind main content */
            overflow: hidden;
        }
        .flower-petal {
            position: absolute;
            top: -10%;
            user-select: none;
            animation-name: fallAndSway;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            opacity: 0.7;
            filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.1));
        }
        @keyframes fallAndSway {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translateY(110vh) translateX(100px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create a container so they don't clutter the body directly
    const container = document.createElement('div');
    container.id = 'flower-container';
    
    // Make sure we wait for body to be available if script is loaded in head
    window.addEventListener('DOMContentLoaded', () => {
        document.body.prepend(container);
        
        const petals = ['🌸', '💮', '🏵️', '🌼', '🌺'];

        function createPetal() {
            const petal = document.createElement('div');
            petal.classList.add('flower-petal');
            petal.innerText = petals[Math.floor(Math.random() * petals.length)];
            
            // Randomize position, size, and speed
            petal.style.left = Math.random() * 100 + 'vw';
            const size = Math.random() * 1 + 0.8; 
            petal.style.fontSize = Math.floor(20 * size) + 'px';
            const duration = Math.random() * 8 + 8; // 8 to 16 seconds falling
            petal.style.animationDuration = duration + 's';
            
            // Randomize slight left/right swaying by creating a random keyframe? 
            // We kept it simple with translateX in the main keyframe, but we can randomize the horizontal drift
            const drift = (Math.random() - 0.5) * 200; // -100px to 100px
            petal.style.setProperty('--drift', drift + 'px');
            
            container.appendChild(petal);
            
            // Clean up petal after it finishes falling
            setTimeout(() => {
                petal.remove();
            }, duration * 1000);
        }

        // Start with an initial batch of flowers already falling
        for(let i=0; i<20; i++) {
            setTimeout(createPetal, Math.random() * 8000);
        }
        
        // Continously spawn new flowers
        setInterval(createPetal, 600);
    });
})();

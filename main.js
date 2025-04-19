document.getElementById("courseForm").addEventListener("submit", function(event) {
    event.preventDefault();
    getRecommendations();
});

function getRecommendations() {
    let userInfo = {
        education: document.getElementById("education").value,
        field_of_study: document.getElementById("field_of_study").value,
        current_status: document.getElementById("current_status").value,
        skills: document.getElementById("skills").value,
        proficiency: document.getElementById("proficiency").value,
        languages: document.getElementById("languages").value,
        learning_goal: document.getElementById("learning_goal").value,
        interests: document.getElementById("interests").value,
        course_duration: document.getElementById("course_duration").value,
        previous_courses: document.getElementById("previous_courses").value,
        free_or_paid: document.getElementById("free_or_paid").value,
        learning_mode: document.getElementById("learning_mode").value,
        weekly_hours: document.getElementById("weekly_hours").value
    };

  fetch("/recommend", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(userInfo)
})
.then(response => response.json()) // Ensure we parse JSON
.then(data => {
    console.log("Response received:", data); // Debugging
    if (Array.isArray(data.recommendations)) {
        displayRecommendations(data.recommendations);
    } else {
        console.error("Invalid response format:", data);
    }
})
.catch(error => console.error("Error fetching recommendations:", error));

}

function displayRecommendations(courses) {
    let recommendationsList = document.getElementById("recommendations");
    recommendationsList.innerHTML = "";

    if (courses.length === 0) {
        recommendationsList.innerHTML = "<li>No courses found. Try adjusting your preferences.</li>";
        return;
    }

    courses.forEach(course => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${course.course_title}</strong><br>
            Rating: ${course.course_rating}<br>
            Organization: ${course.course_organization}<br>
            Students Enrolled: ${course.course_students_enrolled}<br>
            Certification Type: ${course.course_Certificate_type}<br>
            Prerequisites: ${course.Prerequisites}<br>
        `;
        recommendationsList.appendChild(listItem);
    });
}

const canvas = document.getElementById("linesCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lines = [];

class Line {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 150 + 50;
        this.speed = Math.random() * 4 + 2;
        this.opacity = Math.random() * 0.6 + 0.3;
    }

    draw() {
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y + this.length);
        ctx.stroke();
    }

    update() {
        this.x += this.speed;
        this.y += this.speed;

        // Reset line when it moves out of view
        if (this.x > canvas.width || this.y > canvas.height) {
            this.reset();
            this.x = 0;
            this.y = Math.random() * canvas.height;
        }
    }
}

// Create multiple lines
function createLines() {
    for (let i = 0; i < 30; i++) {
        lines.push(new Line());
    }
}

// Animation loop
function animateLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach((line) => {
        line.update();
        line.draw();
    });
    requestAnimationFrame(animateLines);
}

// Resize canvas on window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Initialize and start animation
createLines();
animateLines();

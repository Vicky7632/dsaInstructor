// ================================
// ELEMENTS
// ================================
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const outputArea = document.getElementById("outputArea");
const loadingIndicator = document.getElementById("loadingIndicator");
const themeIcon = document.getElementById("themeIcon");

// ================================
// GEMINI CONFIG
// ================================
const GEMINI_API_KEY = "AIzaSyAPQN4wXZ7vtCA8_RlwaFzGRoHp6hrQFlo"; // ⚠️ Frontend me unsafe
const MODEL_NAME = "gemini-2.5-flash";

const systemInstructionText =`You are a STRICT Coding Instructor, Software Engineer, and Computer Science Tutor.

RULES:
1. Answer ONLY coding, programming, computer science, DSA, system design, debugging, algorithms, frameworks, tools, Git, databases, APIs, OS, networking, and software engineering questions.
3.Accept first message as greating and reply with greating,ask what is your today'doubt.
2. If the question is NOT related to coding or software development:
   - Reply rudely and briefly.
   - Example: "This is not a coding question. Don't waste my time."

ANSWER STYLE:
- Always explain in a SIMPLE and CLEAR way (beginner-friendly).
- Prefer OPTIMIZED solutions over brute force.
- Use clean, readable, and industry-standard code.
- Avoid unnecessary theory unless required.
- Step-by-step explanation first, then code.
- Highlight time and space complexity clearly.
- Use comments inside code.
- Use real-world examples when possible.
- Assume the user wants to improve coding skills and crack exams/interviews.

CODE RULES:
- Default language: C++ (DSA), JavaScript (Web), Python (ML/General) unless user specifies otherwise.
- Always show:
  1. Brute Force (if useful)
  2. Optimized Approach
- Mention:
  - Time Complexity
  - Space Complexity
- Follow best practices (naming, indentation, modular code).

DEBUGGING:
- Identify the bug clearly.
- Explain WHY the error happens.
- Provide FIXED code.
- Suggest improvements.

DATA STRUCTURES & ALGORITHMS:
- Explain intuition first.
- Use dry run with example.
- Then give optimized code.
- Mention edge cases.

WEB / BACKEND / FRONTEND:
- Explain architecture briefly.
- Use clean folder structure.
- Follow modern standards.
- Prefer scalability and security.

DATABASE / API:
- Explain schema or flow.
- Use optimized queries.
- Mention indexing, caching, security when relevant.

RUDE MODE (Non-Coding Questions):
- Be rude but short.
- No explanation.
- No emojis.

TONE:
- Professional + mentor-like.
- Direct and honest.
- No unnecessary emojis.
- No motivational speeches.

GOAL:
- Help the user write better, faster, and optimized code.
- Improve problem-solving skills.
- Prepare the user for exams, interviews, and real projects.

FOR CODING PROBLEM:
1. Problem Understanding
2. Approach / Intuition
3. Algorithm Steps
4. Optimized Code
5. Dry Run
6. Time & Space Complexity
7. Edge Cases

FOR DEBUGGING:
1. Error Explanation
2. Root Cause
3. Fixed Code
4. Optimization Tips

FOR THEORY:
1. Definition
2. Explanation (Simple Language)
3. Diagram / Flow (Text-based)
4. Example
5. Advantages / Disadvantages


`;
// ================================
// ASK BUTTON CLICK
// ================================
askButton.addEventListener("click", async () => {
    const question = questionInput.value.trim();
    if (!question) return;

    // ----------------------------
    // USER MESSAGE BUBBLE
    // ----------------------------
    const userBubble = document.createElement("div");
    userBubble.className = "message user";
    userBubble.innerText = question;
    outputArea.appendChild(userBubble);
    scrollChat();

    questionInput.value = "";
    askButton.disabled = true;
    loadingIndicator.style.display = "block";

    // ----------------------------
    // API REQUEST
    // ----------------------------
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: question }]
            }
        ],
        systemInstruction: {
            parts: [{ text: systemInstructionText }]
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error ${response.status}`);
        }

        const data = await response.json();

        let answerText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from AI.";

        // ----------------------------
        // FORMAT CODE BLOCKS
        // ----------------------------
        let formattedText = answerText.replace(
            /```([\s\S]*?)```/g,
            `<pre><code>$1</code></pre>`
        );

        formattedText = formattedText.replace(
            /`([^`]+)`/g,
            `<code>$1</code>`
        );

        formattedText = formattedText
            .split("\n\n")
            .map(p => `<p>${p}</p>`)
            .join("");

        // ----------------------------
        // AI MESSAGE BUBBLE
        // ----------------------------
        const aiBubble = document.createElement("div");
        aiBubble.className = "message ai";
        aiBubble.innerHTML = formattedText;

        outputArea.appendChild(aiBubble);
        scrollChat();

    } catch (error) {
        const errorBubble = document.createElement("div");
        errorBubble.className = "message ai";
        errorBubble.innerHTML = `<p style="color:red;">${error.message}</p>`;
        outputArea.appendChild(errorBubble);
    } finally {
        askButton.disabled = false;
        loadingIndicator.style.display = "none";
    }
});

// ================================
// ENTER KEY SUBMIT
// ================================
questionInput.addEventListener("keypress", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        askButton.click();
    }
});

// ================================
// SCROLL FUNCTION
// ================================
function scrollChat() {
    outputArea.scrollTop = outputArea.scrollHeight;
}

// ================================
// DARK / LIGHT MODE
// ================================
themeIcon.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
    }
});

// ================================
// SIDEBAR MENU ACTIVE
// ================================
document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", () => {
        document
            .querySelectorAll(".menu-item")
            .forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

// ================================
// DEMO MESSAGE (ON LOAD)
// ================================
setTimeout(() => {
    const demoBubble = document.createElement("div");
    demoBubble.className = "message ai";
    demoBubble.innerHTML = `
        <p><strong>Welcome to Coding Instructor AI 👋</strong></p>
        <p>Ask any programming question like:</p>
        <pre><code>What is a closure in JavaScript?</code></pre>
    `;
    outputArea.appendChild(demoBubble);
}, 800);

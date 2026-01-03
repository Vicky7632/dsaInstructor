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
const GEMINI_API_KEY = "AIzaSyBsPBK2UDDbnggEs2mcB7TxVcZa0QXd1y8"; // ⚠️ Frontend me unsafe
const MODEL_NAME = "gemini-2.5-flash";

const systemInstructionText =
    "You are a Coding Instructor. Answer ONLY coding related questions in detail. If the question is not related to coding, reply rudely.";

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

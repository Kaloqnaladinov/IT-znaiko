// ===== SCRIPT.JS - ИЗКУСТВЕН ИНТЕЛЕКТ =====

// ===== 1. HEADER - ПРОМЯНА НА ЦВЕТА ПРИ СКРОЛ =====
window.addEventListener("scroll", function () {
    const header = document.getElementById("main-header");
    if (window.scrollY > 100) {
        header.style.background =
            "linear-gradient(135deg, #d85a5a 0%, #6b46a1 100%)";
    } else {
        header.style.background =
            "linear-gradient(135deg, #764ba2 0%, #ea6666 100%)";
    }
});

// ===== 2. НАВИГАЦИЯ - ПЛАВНО ПРИКЛЮЦВАНЕ =====
document.querySelectorAll("#main-nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// ===== 3. НАВИГАЦИЯ - СКРИВАНЕ ПРИ СКРОЛ НАДОЛУ =====
let lastScrollTop = 0;
const nav = document.getElementById("main-nav");
window.addEventListener("scroll", function () {
    let currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop && currentScroll > 100) {
        nav.classList.add("nav-hidden");
    } else if (currentScroll < lastScrollTop) {
        nav.classList.remove("nav-hidden");
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ===== 4. GEMINI ЧАТБОТ =====
document.addEventListener("DOMContentLoaded", function () {
    const geminiQuestion = document.getElementById("gemini-question");
    const geminiBtn = document.getElementById("gemini-ask-btn");
    const geminiAnswer = document.getElementById("gemini-answer");
    const geminiThinking = document.getElementById("gemini-thinking");

    if (!geminiBtn || !geminiQuestion || !geminiAnswer || !geminiThinking)
        return;

    geminiBtn.addEventListener("click", async function () {
        const question = geminiQuestion.value.trim();

        if (!question) {
            alert("Моля, напиши въпрос!");
            return;
        }

        // ✅ ПОКАЗВАМЕ ЧАСОВНИКА (въртящ се)
        geminiThinking.style.display = "flex";
        geminiAnswer.innerHTML = ""; // Изчистваме предишния отговор

        try {
            const response = await fetch("http://localhost:3000/ask-gemini", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();

            // ✅ СКРИВАМЕ ЧАСОВНИКА
            geminiThinking.style.display = "none";

            if (
                data.candidates &&
                data.candidates[0]?.content?.parts[0]?.text
            ) {
                const answer = data.candidates[0].content.parts[0].text;
                geminiAnswer.innerHTML = `<p><strong>🤖 Gemini:</strong> ${answer.replace(/\n/g, "<br>")}</p>`;
            } else if (data.error) {
                geminiAnswer.innerHTML = `<p>❌ Грешка: ${data.error}</p>`;
            } else {
                geminiAnswer.innerHTML =
                    "<p>❌ Неочакван отговор от Gemini</p>";
            }
        } catch (error) {
            // ✅ СКРИВАМЕ ЧАСОВНИКА И ПРИ ГРЕШКА
            geminiThinking.style.display = "none";
            geminiAnswer.innerHTML = `<p>❌ Грешка: Сървърът не работи. Пусни <code>node server.js</code> в терминал.</p>`;
        }
    });

    geminiQuestion.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            geminiBtn.click();
        }
    });
});
// ===== 5. SCROLL TO TOP BUTTON =====
const scrollBtn = document.getElementById("scrollTopBtn");
if (scrollBtn) {
    window.addEventListener("scroll", function () {
        scrollBtn.classList.toggle("show", window.scrollY > 300);
    });
    scrollBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

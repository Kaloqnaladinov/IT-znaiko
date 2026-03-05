import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/ask-gemini", async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Липсва въпрос" });
    }

    try {
        console.log("📤 Изпращам към Gemini:", question);
        
        // ВАЖНО: Смених модела на gemini-1.5-flash (работи за всички)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: question }] }]
                }),
            }
        );

        const data = await response.json();
        console.log("📥 Отговор от Gemini:", data);
        
        res.json(data);
    } catch (error) {
        console.error("❌ Грешка в server.js:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
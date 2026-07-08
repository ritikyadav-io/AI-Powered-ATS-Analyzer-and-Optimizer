const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

async function testOpenRouter() {
  console.log("Testing OpenRouter with grok-4-fast:free...");
  
  const b = {
    model: "x-ai/grok-2-vision-1212", // Let's try another model if grok-4-fast doesn't exist, but we will test grok-2-1212
    messages: [
      { role: "system", content: "You are an ATS parser." },
      { role: "user", content: [
        { type: "text", text: "Please parse this resume." },
        { type: "text", text: "Resume:\n\"\"\"John Doe, Software Engineer, JavaScript\"\"\"" }
      ]}
    ],
    temperature: 0.2
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + OPENROUTER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(b)
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text.substring(0, 500));
}

testOpenRouter();

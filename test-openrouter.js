const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

async function testOpenRouter() {
  console.log("Testing OpenRouter Fallback Key...");
  
  const b = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: "You are an ATS parser." },
      { role: "user", content: [
        { type: "text", text: "Please parse this resume." },
        { type: "text", text: "Resume:\n\"\"\"John Doe, Software Engineer, JavaScript\"\"\"" }
      ]}
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  };

  const t0 = Date.now();
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + OPENROUTER_API_KEY,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://elevatecv.app",
      "X-Title": "ElevateCv",
    },
    body: JSON.stringify(b)
  });

  const latency = Date.now() - t0;
  console.log("Status:", res.status);
  console.log("Latency:", latency, "ms");
  
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    console.log("Response JSON received successfully.");
    if (json.error) {
      console.log("OpenRouter Error:", json.error);
    } else {
      console.log("Model Choice Content preview:", json.choices[0].message.content.substring(0, 100));
    }
  } catch (e) {
    console.log("Response Text:", text);
  }
}

testOpenRouter();

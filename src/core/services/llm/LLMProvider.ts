export interface LLMResponse {
  content: string;
  raw: any;
}

export interface LLMProvider {
  name: string;
  generate(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
}

export class OpenAIProvider implements LLMProvider {
  name = "OpenAI";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4o") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      raw: data,
    };
  }
}

export class GeminiProvider implements LLMProvider {
  name = "Gemini";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Gemini API format
    // System instructions are a separate field in newer API versions or can be prepended to prompt
    // For simplicity with v1beta, we'll prepend system prompt or use systemInstruction if available
    const contents = [];

    // Simple prepending strategy for broader compatibility
    let finalPrompt = prompt;
    if (systemPrompt) {
        finalPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: finalPrompt }],
          },
        ],
        generationConfig: {
            temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`
        );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      content: text,
      raw: data,
    };
  }
}

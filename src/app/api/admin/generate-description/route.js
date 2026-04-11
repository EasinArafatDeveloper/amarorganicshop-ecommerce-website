import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Mock response if no API key is provided
            return NextResponse.json({ 
                result: `<p><strong>Description:</strong></p><p>${prompt}</p><ul><li>Organically sourced</li><li>Premium quality</li><li>Healthy choice</li></ul>` 
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const formattedPrompt = `You are an expert E-commerce Copywriter and SEO Specialist. Your task is to rewrite and beautify the following product description.
Goals:
1. Make it sound highly appealing, human-like, engaging, and persuasive.
2. Optimize it for SEO (Search Engine Optimization) with relevant keywords naturally integrated.
3. Structure it beautifully using HTML tags: <h2> or <h3> for subheadings, <p> for paragraphs, <ul> and <li> for features/benefits, and <strong> for highlighting keywords.
4. Add relevant and subtle emojis to make it eye-catching (but don't overdo it).
5. Please output strictly the HTML code so it can be rendered directly. Do NOT wrap it in markdown code blocks like \`\`\`html.

Here is the raw text to improve:
${prompt}`;

        const result = await model.generateContent(formattedPrompt);
        const response = await result.response;
        const text = response.text().replace(/^```html\s*/, '').replace(/```$/, '').trim();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('Error generating description:', error);
        return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
    }
}

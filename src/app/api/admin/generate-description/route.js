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

        const formattedPrompt = `Format and beautify the following product description for an organic store. Make it sound appealing, professional, and use HTML tags like <p>, <ul>, <li>, <strong> for formatting. Only output the HTML, do not include markdown blocks like \`\`\`html:\n\n${prompt}`;

        const result = await model.generateContent(formattedPrompt);
        const response = await result.response;
        const text = response.text().replace(/^```html\s*/, '').replace(/```$/, '').trim();

        return NextResponse.json({ result: text });
    } catch (error) {
        console.error('Error generating description:', error);
        return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
    }
}

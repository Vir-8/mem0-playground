// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const referer = req.headers.referer;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  } else if (process.env.NODE_ENV !== "development") {
    if (!referer || referer !== process.env.APP_URL) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ message: "User message is required" });
  }
  const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(userMessage);
    const aiResponse = result.response.text();
    const formattedResponse = aiResponse
      .replace(/\n/g, "<br />") // Convert new lines to <br />
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **text** to <strong>text</strong>
      .replace(/- (.*?)(?=<br>|$)/g, "<li>$1</li>"); // Convert bullet points to <li>
    res.status(200).json({ response: `${formattedResponse}` });
  } catch {
    res.status(500).json({ message: "Something went wrong..." });
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {Configuration, OpenAIApi} from "openai";

async function getRecs(location: string, days: number) {

  const openai = new OpenAIApi(
      new Configuration({
        apiKey: "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"//process.env.OPENAI_API_KEY,
      })
  );

  const rawResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "user",
        content:
            "plan a 5 day itinerary for tokyo japan, but do not print it, extract only the key words that are places in the itinerary and list them out with bullets. also remove the days",
      },
    ],
    max_tokens: 3500,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const response = rawResponse.data


  const content: string = response.choices[0].message.content;
  const contentArray = content.split("\n");
  for (let i = 0; i < contentArray.length; i++) {
    if (contentArray[i][0] === '-') {
      contentArray[i] = contentArray[i].slice(2)
    }
  }
  //console.log(contentArray);


  return contentArray
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //console.log(req.query)
  const query = req.query
  const location = query?.location
  const daysString = query?.days
  if (!location || !daysString || Array.isArray(location) || Array.isArray(daysString)) {
    res.status(500).json({ "error_code": "bad request" })
    return
  }

  const days = parseInt(daysString, 10);
  if (Number.isNaN(days) || days < 1 || days > 5) {
    res.status(500).json({ "error_code": "bad request" })
    return
  }

  const results = await getRecs(location, days)
  res.status(200).json(results)


}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next' //imports the api necessary to run on the website
import {Configuration, OpenAIApi} from "openai"; //imports openai so we can call it later

async function getRecs(location: string, days: number) { //takes in an input from the website url
  const openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY, //tells the program to read an environment variable outside the program to get the api key cause its secret
      })
  );

  const rawResponse = await openai.createChatCompletion({ //makes a web request and returns the response
    model: "gpt-3.5-turbo-0613",  //takes the specific model of chat gbt
    messages: [   //the prompt we give chat
      {
        role: "user", //lets chat know that we will be giving it a prompt as a user
        content: //the prompt
            `plan a ${days} day itinerary for ${location}, but do not print it out, extract key words that are locations and list them out under their respective days according to the format provided below.
ex. 
Day 1:
activity 1
activity 2
activity 3

Day 2:
activity 1
activity 2
activity 3

Day 3:
activity 1
activity 2
activity 3`,
      },
    ],

    max_tokens: 200, //parameters we set
    temperature: 0,   //check this cause i ain't writing allat: https://platform.openai.com/docs/api-reference/completions/create?lang=node.js
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const response = rawResponse.data //manually gets the data from the response and assigns it to a variable

  const content: string | undefined = response.choices[0].message?.content; //makes a variable 'content' and assigns it to the content portion of the response
  if (!content) return [] //if there is no content then return an empty string
  const contentArray = content.split("\n"); //splits the content list into an array individual strings
  for (let i = 0; i < contentArray.length; i++) { //for loop for the length of the content array
    if (contentArray[i][0] === '-') {     //if the current string starts with a -,
      contentArray[i] = contentArray[i].slice(2)  //removes the first 2 characters
    }
    if (/^[0-9]/.test(contentArray[i])) {
      contentArray[i] = contentArray[i].slice(3)
    }
  }

  let bigChunk = [];
  let chunk = [];

  for (let i = 0; i < contentArray.length; i++) {
    if (contentArray[i] !== '') {
      if (i === 0) {
        chunk = [];
      } else if (contentArray[i].startsWith('Day') && i !== 0) {
        bigChunk.push(chunk);
        chunk = [];
      } else {
        chunk.push(contentArray[i]);
      }
    }
  }

  bigChunk.push(chunk);

  //console.log(contentArray);

  return bigChunk //returns the split up and edited array of strings
}

export default async function handler( //calls the function automatically
  req: NextApiRequest,
  res: NextApiResponse
) {
  //console.log(req.query)
  const query = req.query //grabs query part of the url
  const location = query?.location  //grabs the location from the query
  const daysString = query?.days //grabs the days from the query
  if (!location || !daysString || Array.isArray(location) || Array.isArray(daysString)) { //if there is not a location or day
    res.status(500).json({ "error_code": "bad request" })   //sends a bad request error code to the user
    return      //kill yourself (tells the function to kill itself since the rest of the program doesn't need to operate it can kill itself)
  }

  const days = parseInt(daysString, 10); //makes a variable 'days' which is the integer form of the daysString
  if (Number.isNaN(days) || days < 1 || days > 14) { //if the number of days is less than one or more than 5...
    res.status(500).json({ "error_code": "bad request" }) //respond with an error code
    return //kill yourself (look at other kill yourself message)
  }

  const results = await getRecs(location, days) //getRecs is the function we used earlier to call GBT to give us recommendations
  res.status(200).json(results)      //gives the results of the recommendations


}

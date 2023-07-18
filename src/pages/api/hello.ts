// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

function getRecs(location: string, days: number) {
  return [["merlion", "sentosa"], ["orchard road", "hawker center"]]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.query)
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

  const results = getRecs(location, days)
  res.status(200).json(results)


}

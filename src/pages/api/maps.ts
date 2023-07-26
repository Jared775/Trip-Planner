// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, {AxiosRequestConfig} from "axios"; //imports the api necessary to run on the website


type PhotoDetails = {
  "height": number,
  "html_attributions": string[],
  "photo_reference": string,
  "width": number
}

type CandidateDetails = {
  "photos": PhotoDetails[],
  "place_id": string
}

type FindPlaceResponseData = {
  "candidates": CandidateDetails[],
  "status": string
}

async function getPlace(location: string, button: string) { //takes in an input from the website url
                                                            // Initialize and add the map
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
    headers: { },
    // ?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry
    params: {
      input: location + ' ' + button,
      inputtype: 'textquery',
      key: process.env.GOOGLEMAPS_API_KEY,
      fields: 'place_id,photo'
    }
  };
  const response = await axios(config)


  const data: FindPlaceResponseData = response.data
  if (data.candidates.length == 0){
    return null
  }
  const place = data.candidates[0]
  if (place.photos.length == 0){
    return null
  }
  const photo = place.photos[0]
  const photoId = photo.photo_reference
  const placeId = place.place_id
  return {photoId, placeId}

}

export default async function handler( //calls the function automatically
  req: NextApiRequest,
  res: NextApiResponse
) {
  //console.log(req.query)
  // if (!location || !daysString || Array.isArray(location) || Array.isArray(daysString)) { //if there is not a location or day
  //   res.status(500).json({ "error_code": "bad request" })   //sends a bad request error code to the user
  //   return      //kill yourself (tells the function to kill itself since the rest of the program doesn't need to operate it can kill itself)
  // }
  //
  // const days = parseInt(daysString, 10); //makes a variable 'days' which is the integer form of the daysString
  // if (Number.isNaN(days) || days < 1 || days > 14) { //if the number of days is less than one or more than 5...
  //   res.status(500).json({ "error_code": "bad request" }) //respond with an error code
  //   return //kill yourself (look at other kill yourself message)
  // }
  const query = req.query
  const location = query?.location
  const button = query?.button
  if (!location || Array.isArray(location)){
    res.status(400).json({'error_code': 'location invalid'})
    return
  }
  if (!button || Array.isArray(button)){
    res.status(400).json({'error_code': 'button invalid'})
    return
  }

  const getPlaceResult = await getPlace(location, button)
  if (!getPlaceResult){
    res.status(500).json({'error_code': 'getPlace null'})
    return
  }
  res.status(200).json(getPlaceResult)


}

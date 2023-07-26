// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios, {AxiosRequestConfig} from "axios"; //imports the api necessary to run on the website

async function getPhoto(photoId:string){
  // Initialize and add the map
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://maps.googleapis.com/maps/api/place/photo',
    headers: { },
    responseType: 'arraybuffer',
    // ?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry
    params: {
      maxwidth: 720,
      photo_reference: photoId,
      key: process.env.GOOGLEMAPS_API_KEY,
    }
  };
  const response = await axios(config)
  const photo: ArrayBuffer | null = response.data

  return photo

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

  const photoId = query?.photoId
  if (!photoId || Array.isArray(photoId)){
    res.status(400).json({'error_code': 'photoId invalid'})
    return
  }

  const getPhotoResult = await getPhoto(photoId)
  res.status(200).write(getPhotoResult)      //gives the results of the recommendations


}

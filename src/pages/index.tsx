import Image from 'next/image'
import { Inter } from 'next/font/google'
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [content, setContent] = useState<string[][]>([])

  const {             //calls on the object useForm() and assigns some of its attributes to the variables below
    register,         //calls on the register attribute of the object, useForm()
    handleSubmit,     //calls on the handleSubmit attribute of useForm()
    formState: { errors, isSubmitting },  //calls on the formstate attribute of useform, but also calls on the errors and isSubmitting attribute of formState
  } = useForm();

  const submit = async (data: FieldValues) => {
    try {
      const response = await axios.get('/api/hello', {
        params: {
          location: data.location,
          days: data.days
        }
      });

      // Access the response data
      setContent(response.data)
      // Process the data further as needed

    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <form onSubmit={handleSubmit(submit)} className={'flex flex-col'}>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
        <input className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
               placeholder="ex. Tokyo, Japan"
               {...register('location', { required: true })}
        />
        {errors.location && <p>Location is required.</p>}
        {/*^checks if there is an error and the && checks if both conditions are true, and if they are then it displays the message*/}

        <label htmlFor="password" className="mt-6 block text-sm font-medium text-gray-900 dark:text-white">Number of days</label>
        {/*mt increases or decreases the amount of gap between the two boxes*/}
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               {...register('days', { pattern: /\d+/ })} />
        {errors.days && <p>Please enter number for days.</p>}

        <button disabled={isSubmitting} className="mt-3 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#E5E7EB"/>
    <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"/>
    </svg>

          </span>}
          Submit
        </button>
      </form>

      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">{JSON.stringify(content)}</p>
      </div>
    </main>
  )
}

import Image from 'next/image'
import { Inter } from 'next/font/google'
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [content, setContent] = useState<string[][]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      <form onSubmit={handleSubmit(submit)} className={'flex flex-col gap-4'}>
        <input {...register('location', { required: true })} />
        {errors.location && <p>Location is required.</p>}
        <input {...register('days', { pattern: /\d+/ })} />
        {errors.days && <p>Please enter number for days.</p>}
        <input type="submit" />
      </form>

      <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">{JSON.stringify(content)}</p>
      </div>

    </main>
  )
}

import {Dispatch, SetStateAction, useState} from "react";
import Datepicker from "tailwind-datepicker-react";


const defaultOptions = {
    autoHide: true,
    todayBtn: false,
    clearBtn: false,
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    datepickerClassNames: " ml-auto mr-auto",
    theme: {
        background: "bg-gray-100 dark:bg-gray-700",
        todayBtn: "",
        clearBtn: "",
        icons: "",
        text: "",
        disabledText: "cursor-not-allowed text-opacity-50",
        input: "",
        inputIcon: "",
        selected: "",
    },
    icons: {
        // () => ReactElement | JSX.Element
        prev: () => <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"/>
        </svg>,
        next: () => <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"/>
        </svg>,
    },
    defaultDate: new Date(),
    language: "en",
}

export const DatePicker = (props: {date:Date, setDate:Dispatch<SetStateAction<Date>>, minDate?: Date, maxDate?: Date}) => {
    let {date, setDate, minDate, maxDate} = props;
    const [show, setShow] = useState(false)
    const handleChange = (selectedDate: Date) => {
        setDate(selectedDate)
    }
    const handleClose = (state: boolean) => {
        setShow(state)

    }
    const options = {
        ...defaultOptions,
        minDate: minDate??defaultOptions.minDate,
        maxDate: maxDate??defaultOptions.maxDate
    }
    return (
        <Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
    )
}


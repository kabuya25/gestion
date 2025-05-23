"use client"

import Loading from "@/app/_loading/loading"

import Success from "@/app/_modals/success"

import {useEffect, useState} from "react"

import {XMarkIcon} from '@heroicons/react/20/solid'
import {delete_reservation, get_reservations} from "@/logic/management/reservation";
import Error from "@/app/_modals/error";


export default function Example() {
    const [loading, setLoading] = useState(false)
    const [reservations_list, setReservations_list] = useState([])

    const [error, setError] = useState(false);
    const [error_text, setError_text] = useState({
        title:"",
        message:"",
        button:""
    });

    const [success, setSuccess] = useState(false);
    const [success_text, setSuccess_text] = useState({
        title:"",
        message:"",
        button:""
    });

    const load_reservation = async () => {
        setLoading(true)
        const response = await get_reservations()
        if(response === false) {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setError(true)
        } else if(response){
            setReservations_list(Array.isArray(response) ? response : [])
        }

        setLoading(false)

    }

    const submit_delete = async (reservation_id) => {
        setLoading(true)
        const response = await delete_reservation(reservation_id)

        if(response === true) {
            await load_reservation()
        } else if (response === false) {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setError(true)
        }

        setLoading(false)
    }

    useEffect(() => {
        load_reservation()
    },[])
    return (
        <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
            {loading ? <Loading /> : null}
            <Error
                error={error}
                setError={setError}
                title={error_text.title}
                message={error_text.message}
                button={error_text.button}
            />
            <Success
                success={success}
                setSuccess={setSuccess}
                title={success_text.title}
                message={success_text.message}
                button={success_text.button}
            />
            {reservations_list.map((reservation) => (
                <li key={reservation.reservation_id} className="overflow-hidden rounded-xl border border-gray-200">
                    <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                        <div
                            className={'size-12 flex-none rounded-lg object-cover ring-1 ring-gray-900/10 text-sm font-medium text-white bg-purple-600 flex justify-center items-center'}
                        >
                            {reservation.teacher}
                        </div>
                        <div className="text-sm/6 font-medium text-gray-900">{reservation.discipline}</div>
                        <div  className="relative ml-auto">
                            <div
                                className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
                                onClick={() => {submit_delete(reservation.reservation_id)}}
                            >
                                <span className="sr-only">Open options</span>
                                <XMarkIcon aria-hidden="true" className="size-8"/>
                            </div>
                        </div>
                    </div>
                    <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-gray-500">Starts at</dt>
                            <dd className="text-gray-700">
                                <time dateTime={reservation.starting}>{reservation.starting}</time>
                            </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-gray-500">Ends at</dt>
                            <dd className="text-gray-700">
                                <time dateTime={reservation.ending}>{reservation.ending}</time>
                            </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                            <dt className="text-gray-500">Room</dt>
                            <dd className="flex items-start gap-x-2">
                                <div className="font-medium text-gray-900">{reservation.room}</div>
                            </dd>
                        </div>
                    </dl>
                </li>
            ))}
        </ul>
    )
}

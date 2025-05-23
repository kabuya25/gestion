"use client"

import Success from "@/app/_modals/success"
import Error from "@/app/_modals/error"

import Loading from "@/app/_loading/loading"

import {useState, useEffect} from "react"
import {join_class, get_classes_join} from "@/logic/management/classes";

export default function Example() {
    const [loading, setLoading] = useState(false);

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

    const [classes_list, setClasses_list] = useState([])

    const load_classes = async () => {
        setLoading(true)
        const response = await get_classes_join()

        if(response === false) {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setError(true)
        } else if(response){
            setClasses_list(response)
        }

        setLoading(false)
    }

    const submit_class = async (class_id) => {
        setLoading(true)
        const response = await join_class(class_id)

        if(response === true){
            setSuccess_text({
                title:"Classe joined!",
                message:"You successfully joined the class!",
                button:"Close"
            })
            setSuccess(true)
            await load_classes()
        } else {
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
        load_classes()
    },[])
    return (
        <div className="px-4 sm:px-6 lg:px-8 h-screen">
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
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Classes</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the available classes.
                    </p>
                </div>

            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Start at
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    End at
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Discipline
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Teacher
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Room
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Remaining reservations
                                </th>

                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {classes_list.length > 0 ? classes_list.map((clas) => (
                                <tr key={clas.class_id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {clas.time}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{clas.ending}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{clas.discipline}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{clas.teacher}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{clas.room}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{clas.capacity}</td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <button
                                            disabled={ clas.capacity <= 0 }
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => {submit_class(clas.class_id)}}
                                        >
                                            {clas.is_joined ? "Cancel" : clas.capacity <= 0 ? "Full" : "Join"}
                                        </button>
                                    </td>
                                </tr>
                            )) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

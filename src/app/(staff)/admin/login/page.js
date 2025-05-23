"use client"

import {useRef, useState} from "react";

import {admin_login} from "@/logic/account/login";
import Loading from "@/app/_loading/loading";
import Error from "@/app/_modals/error"
import {useRouter} from "next/navigation";



export default function Example() {
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const user = useRef()
    const password = useRef()

    const submit = async (e) => {
        setLoading(true)
        e.preventDefault()

        const formData = new FormData(e.target);


        const response = await admin_login(formData)

        if (response === true) {
            router.push("/admin/dashboard/classes");
            console.log("connected")
        } else if (response === false) {
            console.log("not connected")
            setLoading(false)
        } else {
            setError(true);
            setLoading(false)
        }


    }

    return (
        <div>
            {loading ? <Loading/> : null}
            <Error
                title={"Invalid credentials"}
                message={"Your credentials are invalid"}
                button={"close"}
                error={error}
                setError={setError}
            />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                User
                            </label>
                            <div className="mt-2">
                                <input
                                    ref={user}
                                    id="user"
                                    name="user"
                                    type="text"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    ref={password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

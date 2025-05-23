'use client'

import {useState, useRef, useEffect} from 'react'
import {redirect} from "next/navigation";
import {ChevronDownIcon} from '@heroicons/react/16/solid'
import {Field, Label, Switch} from '@headlessui/react'

import {add_user} from "@/logic/account/login";

import Success from '../../_modals/success'
import Error from '../../_modals/error'
import Loading from '../../_loading/loading'

export default function Example() {
    const [agreed, setAgreed] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [counter, setCounter] = useState(`10 seconds`)

    const error_message = "This field is empty!"


    // Inputs
    const firstname = useRef()
    const lastname = useRef()
    const email = useRef()
    const password = useRef()
    const phone = useRef()
    const phone_input = useRef()
    const about = useRef()


    // Error prompts
    const firstname_error = useRef();
    const lastname_error = useRef();
    const email_error = useRef();
    const password_error = useRef();
    const phone_error = useRef();
    const agreed_error = useRef();


    //
    const submit = async (e) => {
        setLoading(true)
        e.preventDefault();
        reset_errors()
        if (!agreed) {
            agreed_error.current.innerHTML = "You have to agree to proceed further!";
            setLoading(false)
            return
        }

        const formData = new FormData(e.target);

        const response = await add_user(formData);

        if (response === true) {
            begin_timer()
            setSuccess(true)
            reset_field()
        } else if (response === false) {
            setError(true)
        } else {
            if (isEmpty(response)) {
                setLoading(false)
                return
            }

            if(response === "phone length") {
                error_ui(phone, phone_error, "The phone number is not valid!")
                setLoading(false)
                return
            }

            if(response === "email exists") {
                error_ui(email, email_error, "This email is already taken!")
                setLoading(false)
                return
            }

            if(response === "phone exists") {
                error_ui(phone, phone_error, "The phone number is already taken!")
                setLoading(false)
                return
            }



        }

        setLoading(false)
    }


    const reset_errors = () => {
        firstname.current.classList.remove("focus:outline-red-600");
        firstname.current.classList.add("focus:outline-indigo-600");
        firstname_error.current.innerHTML = "&nbsp;";

        lastname.current.classList.remove("focus:outline-red-600");
        lastname.current.classList.add("focus:outline-indigo-600");
        lastname_error.current.innerHTML = "&nbsp;";

        email.current.classList.remove("focus:outline-red-600");
        email.current.classList.add("focus:outline-indigo-600");
        email_error.current.innerHTML = "&nbsp;";

        password.current.classList.remove("focus:outline-red-600");
        password.current.classList.add("focus:outline-indigo-600");
        password_error.current.innerHTML = "&nbsp;";

        phone.current.classList.remove("has-[input:focus-within]:outline-red-600");
        phone.current.classList.add("has-[input:focus-within]:outline-indigo-600");
        phone_error.current.innerHTML = "&nbsp;";

        agreed_error.current.innerHTML = "&nbsp;";
    }


    const isEmpty = (response) => {

        switch (response) {
            case "firstName":
                error_ui(firstname, firstname_error, error_message)
                return true

            case "lastName":
                error_ui(lastname, lastname_error, error_message)
                return true

            case "email":
                error_ui(email, email_error, error_message)
                return true

            case "password":
                error_ui(password, password_error, error_message)
                return true

            case "phone":
                error_ui(phone, phone_error, error_message)
                return true
        }

        return false
    }


    const reset_field = () => {
        firstname.current.value = "";
        lastname.current.value = "";
        email.current.value = "";
        password.current.value = "";
        phone_input.current.value = "";
        about.current.value = "";
        setAgreed(false)
    }


    const error_ui = (tag, error_tag, message) => {
        error_tag.current.innerHTML = message;
        tag.current.classList.remove("has-[input:focus-within]:outline-indigo-600");
        tag.current.classList.add("has-[input:focus-within]:outline-red-600");
        tag.current.focus()
    }


    const begin_timer = () => {
        let timer = 10
        setInterval(() => {
            timer--
            if(timer > 1 ){
                setCounter(`${timer} seconds`)
            } else if(timer === 1){
                setCounter(`${timer} second`)
            } else if(timer === 0){
                setCounter(`${timer} second`)
            } else {
                redirect("/login")
            }
        }, 1000)
    }


    useEffect(() => {

    },[])


    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            {loading ? <Loading/> : null}
            <Error
                error={error}
                setError={setError}
                title="Error"
                message="An error occurred during the process. Please try again later."
                button="close"
            />
            <Success
                success={success}
                setSuccess={setSuccess}
                redirect={() => {}}
                title="Success"
                message={`Your account has been created successfully and will be redirected in ${counter}`}
                button="close"
            />
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                />
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Sign up today!</h2>
                <p className="mt-2 text-lg/8 text-gray-600">{/*a remplir plus tard*/}</p>
            </div>
            <form onSubmit={submit} className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                            First name
                        </label>
                        <div className="mt-2.5">
                            <input
                                ref={firstname}
                                id="first-name"
                                name="first-name"
                                type="text"
                                placeholder={"John"}
                                autoComplete="given-name"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                        <div ref={firstname_error} className="text-red-500 mx-2">
                            &nbsp;
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2.5">
                            <input
                                ref={lastname}
                                id="last-name"
                                name="last-name"
                                type="text"
                                placeholder={"Doe"}
                                autoComplete="family-name"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                        <div ref={lastname_error} className="text-red-500 mx-2">
                            &nbsp;
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
                            Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                ref={email}
                                id="email"
                                name="email"
                                type="email"
                                placeholder={"lorem@ispum.com"}
                                autoComplete="organization"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                            />
                        </div>
                        <div ref={email_error} className="text-red-500 mx-2">
                            &nbsp;
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                            Password
                        </label>
                        <div className="mt-2.5">
                            <div className="mt-2.5">
                                <input
                                    ref={password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={"test"}
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                />
                            </div>
                        </div>
                        <div ref={password_error} className="text-red-500 mx-2">
                            &nbsp;
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
                            Phone number
                        </label>
                        <div className="mt-2.5">
                            <div
                                ref={phone}
                                className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country"
                                        aria-label="Country"
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3.5 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    >
                                        <option value={"+32"}>BE</option>
                                        <option value={"+1"}>US</option>
                                        <option value={"+1"}>CA</option>

                                    </select>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                                <input
                                    ref={phone_input}
                                    id="phone"
                                    name="phone"
                                    type="phone"
                                    placeholder="0469126945"
                                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div ref={phone_error} className="text-red-500 mx-2">
                            &nbsp;
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                            A little bit about me
                        </label>
                        <div className="mt-2.5">
                              <textarea
                                  ref={about}
                                  id="about"
                                  name="about"
                                  rows={4}
                                  className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                  defaultValue={''}
                              />
                        </div>
                    </div>
                    <Field name={"agreement"} className="flex gap-x-4 sm:col-span-2">
                        <div className="flex h-6 items-center">
                            <Switch
                                checked={agreed}

                                onChange={setAgreed}
                                className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
                            >
                                <span className="sr-only">Agree to policies</span>
                                <span
                                    aria-hidden="true"
                                    className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                                />
                            </Switch>
                        </div>
                        <Label className="text-sm/6 text-gray-600">
                            By selecting this, you agree to our{' '}
                            <a href="#" className="font-semibold text-indigo-600">
                                privacy&nbsp;policy
                            </a>
                            .
                        </Label>

                    </Field>
                    <div ref={agreed_error} className="text-red-500 mx-2 w-full">
                        &nbsp;
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

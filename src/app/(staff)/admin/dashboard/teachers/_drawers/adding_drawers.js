'use client'

import { useState, useRef } from 'react'
import {Dialog, DialogPanel, DialogTitle, Field, Label, Switch} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Example(props) {

    return (
        <Dialog open={props.add_drawer} onClose={props.close_add_teacher_drawer} className="relative z-10">
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                        >
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                <div className="px-4 sm:px-6 ">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-base font-semibold text-gray-900">Adding teacher</DialogTitle>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                type="button"
                                                onClick={props.close_add_teacher_drawer}
                                                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon aria-hidden="true" className="size-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative mt-6 flex-1 px-4 sm:px-6  flex flex-col">
                                    <form className="mx-auto mt-16 max-w-xl sm:mt-20 bg-white flex flex-col grow">
                                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="first-name"
                                                       className="block text-sm/6 font-semibold text-gray-900">
                                                    First name
                                                </label>
                                                <div className="mt-2.5">
                                                    <input
                                                        ref={props.add_firstname}
                                                        id="first-name"
                                                        name="first-name"
                                                        type="text"
                                                        placeholder={"John"}
                                                        autoComplete="given-name"
                                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                    />
                                                </div>
                                                <div ref={props.add_firstname_error} className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="last-name"
                                                       className="block text-sm/6 font-semibold text-gray-900">
                                                    Last name
                                                </label>
                                                <div className="mt-2.5">
                                                    <input
                                                        ref={props.add_lastname}
                                                        id="last-name"
                                                        name="last-name"
                                                        type="text"
                                                        placeholder={"Doe"}
                                                        autoComplete="family-name"
                                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                    />
                                                </div>
                                                <div ref={props.add_lastname_error} className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div className={"col-span-2 grid grid-cols-2 items-center gap-2"}>
                                                <div className={"col-span-1"}>
                                                    <div className="">
                                                        <select
                                                            ref={props.selected_discipline}
                                                            id="Discipline"
                                                            name="Discipline"
                                                            autoComplete="family-name"
                                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                        >
                                                            <option defaultValue key={null} value={-1}>Select a discipline</option>
                                                            {props.available_discipline.length > 0 ?
                                                                props.available_discipline.filter( discipline =>
                                                                    !props.badge.some(b => parseInt(b.id) === parseInt(discipline.discipline_id))
                                                                ).map((discipline) => (
                                                                <option key={discipline.discipline_id} value={discipline.discipline_id}>{discipline.name}</option>
                                                            )):null}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className={"col-span-1"}>
                                                    <button
                                                        type="button"
                                                        onClick={() => props.adding_badge()}
                                                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                <div className="text-red-500 mx-2 col-span-1">
                                                    &nbsp;
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"grow"}>
                                            {props.badge.map((item) => (
                                                <span
                                                    key={item.id}
                                                    className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-100 px-2 py-1 mx-2 my-2 text-md font-medium text-blue-700">
                                                    {item.name}
                                                <button
                                                    type="button"
                                                    className="group relative -mr-1 size-3.5 rounded-sm hover:bg-blue-600/20"
                                                    onClick={() => {props.remove_badge(item.id)}}
                                                >
                                                  <span className="sr-only">Remove</span>
                                                  <svg viewBox="0 0 14 14"
                                                       className="size-3.5 stroke-blue-800/50 group-hover:stroke-blue-800/75">
                                                    <path d="M4 4l6 6m0-6l-6 6"/>
                                                  </svg>
                                                  <span className="absolute -inset-1"/>
                                                </button>
                                              </span>
                                            ))}
                                        </div>
                                        <div className="mt-10">
                                        <button
                                                type="button"
                                                onClick={props.add_submit}
                                                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

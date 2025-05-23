'use client'

import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import DatePicker from "react-datepicker"

export default function Example(props) {

    return (
        <Dialog open={props.adding_drawer} onClose={props.close_adding_drawer} className="relative z-10">
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <DialogPanel
                            transition
                            className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                        >
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                <div className="px-4 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <DialogTitle className="text-base font-semibold text-gray-900">Schedule a class</DialogTitle>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                type="button"
                                                onClick={props.close_adding_drawer}
                                                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <XMarkIcon aria-hidden="true" className="size-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative mt-6 flex-1 px-4 sm:px-6 flex flex-col">
                                    <form onSubmit={(e) => {props.adding_submit(e)}} className="mx-auto mt-16 max-w-xl sm:mt-20 w-full  grow-1 flex flex-col justify-between">
                                        <div className="flex flex-col gap-y-2">
                                            <div>
                                                <div className="">
                                                    <select
                                                        id="room"
                                                        name="room"
                                                        required
                                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                    >
                                                        <option value="">Room</option>
                                                        {props.add_list_rooms.length > 0 ? props.add_list_rooms.map((room) =>
                                                            <option key={room.room_id} value={room.room_id}>{room.name}</option>
                                                        ) : null}
                                                    </select>
                                                </div>
                                                <div className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div>
                                                <div className="">
                                                    <select
                                                        id="teacher"
                                                        name="teacher"
                                                        required
                                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                        onChange={(e) => {
                                                            if(e.target.value !== "") {
                                                                props.adding_update_disciplines(parseInt(e.target.value))
                                                            } else {
                                                                props.adding_update_disciplines(-1)
                                                                props.setIsAddSelectedDiscipline(false)
                                                            }
                                                            console.log(e.target.value)
                                                        }}
                                                    >
                                                        <option key={-1} value={""}>Teacher</option>
                                                        {props.add_list_teachers.length > 0 ? props.add_list_teachers.map((teacher) =>
                                                            <option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.teacher}</option>
                                                        ) : null}
                                                    </select>
                                                </div>
                                                <div className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div>
                                                <div className="">
                                                    <select
                                                        id="discipline"
                                                        name="discipline"
                                                        required
                                                        disabled={props.add_list_disciplines.length < 1}
                                                        onChange={(e) => {
                                                            if(e.target.value !== "") {
                                                                props.setIsAddSelectedDiscipline(true)
                                                            } else {
                                                                props.setIsAddSelectedDiscipline(false)
                                                            }
                                                            console.log(e.target.value)
                                                        }}
                                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                    >
                                                        <option key={-1} value={""}>Discipline</option>
                                                        {props.add_list_disciplines.length > 0 ? props.add_list_disciplines.map((discipline) =>
                                                            <option key={discipline.discipline_id} value={discipline.discipline_id}>{discipline.name}</option>
                                                        ) : null}
                                                    </select>
                                                </div>
                                                <div className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div>
                                                <div className="">
                                                    <input
                                                        id="date"
                                                        name="date"
                                                        type="datetime-local"
                                                        required
                                                        disabled={!(props.is_add_selected_discipline && !props.add_list_disciplines.length < 1)}
                                                        min={props.current_time}
                                                        defaultValue={props.current_time}
                                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                                    />
                                                </div>
                                                <div className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    className="flex items-center rounded-md bg-white px-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                                    <div
                                                        className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                                                    </div>
                                                    <input
                                                        id="length"
                                                        name="length"
                                                        type="number"
                                                        required
                                                        disabled={!(props.is_add_selected_discipline && !props.add_list_disciplines.length < 1)}
                                                        placeholder="Length of the class"
                                                        onInput={(e) => {
                                                            const number = parseInt(e.target.value)
                                                            if(!Number.isInteger(number) || number <= 0){
                                                                e.target.value = 1
                                                            }
                                                        }}
                                                        className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                                                    />
                                                    <div id="price-currency"
                                                         className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                                                        Min
                                                    </div>
                                                </div>
                                                <div className="text-red-500 mx-2">
                                                    &nbsp;
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-10">
                                            <button
                                                type="submit"
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

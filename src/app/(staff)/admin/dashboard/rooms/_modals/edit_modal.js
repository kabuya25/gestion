'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function Example(props) {

    return (
        <Dialog open={props.editModal} onClose={() => {props.setEditModal(false)}} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <form onSubmit={(e) => props.submit_edit_room(e, props.current_room.room_id)} className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div>
                            <div className="mt-3 text-center sm:mt-5">
                                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                    Adding room
                                </DialogTitle>
                                <div className="mt-2">
                                    <div className="text-sm text-gray-500">
                                        <div>
                                            <div className="mt-2">
                                                <input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={props.current_room.name}
                                                    type="text"
                                                    placeholder="Name"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mt-2">
                                                <input
                                                    id="capacity"
                                                    name="capacity"
                                                    type="number"
                                                    defaultValue={props.current_room.capacity}
                                                    onInput={(e) => {
                                                        const number = parseInt(e.target.value)
                                                        if(!Number.isInteger(number) || number <= 0){
                                                            e.target.value = 1
                                                        }
                                                    }}
                                                    placeholder="Capacity"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 flex flex-row gap-x-2">
                            <button
                                type="button"
                                onClick={() => props.submit_delete_room(props.current_room.room_id, props.current_room.name)}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                Delete
                            </button>
                            <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Modify
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </form>
        </Dialog>
    )
}

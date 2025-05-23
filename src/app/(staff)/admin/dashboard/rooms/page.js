"use client"

import Add_modal from "./_modals/add_modal"
import Edit_modal from "./_modals/edit_modal"
import Success_modal from "../../../../_modals/success"
import Error_modal from "../../../../_modals/error"
import Loading from "../../../../_loading/loading"

import {useState, useEffect} from "react";

import {get_rooms, get_room, adding_room, edit_room, delete_room} from "@/logic/management/rooms"

export default function Example() {
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState(false)
    const [error_text, setError_text] = useState({
        title:``,
        message:``,
        button:""
    })

    const [success, setSuccess] = useState(false)
    const [success_text, setSuccess_text] = useState({
        title:``,
        message:``,
        button:""
    })


    const [addModal, setAddModal] = useState(false)

    const [editModal, setEditModal] = useState(false)
    const [current_room, setCurrentRoom] = useState([])


    const [rooms, setRooms] = useState([])

    const load_rooms = async () => {
        setLoading(true)

        const response = await get_rooms()


        if (response) {
            setRooms(response)
        }

        setLoading(false)

    }

    useEffect(() => {
        load_rooms()
    },[])

    const submit_add_room = async (e) => {
        setLoading(true)
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', e.target.name.value.trim())
        formData.append('capacity', parseInt(e.target.capacity.value))

        const response = await adding_room(formData)


        if (response === true) {
            const name = e.target.name.value.trim()[0].toUpperCase() + e.target.name.value.trim().substring(1)
            setAddModal(false)
            setSuccess(true)
            setSuccess_text({
                title:`Added successfully!`,
                message:`The room ${name} has been added successfully.`,
                button:"close"
            })
            load_rooms()
        } else if(response) {
            if (response === "empty") {
                setError_text({
                    title: `No name!`,
                    message: `You didn't enter any name!`,
                    button: "close"
                })
            } else if (response === "room exists") {
                setError_text({
                    title:`Name taken!`,
                    message:`The name ${name} already exists.`,
                    button:"close"
                })

            } else if (response === "NaN") {
                setError_text({
                    title:`Incorrect value!`,
                    message:`You didn't enter a correct value for the capacity.`,
                    button:"close"
                })
            } else if (response === "big") {
                setError_text({
                    title:`Too big!`,
                    message:`Please enter a capacity from 0 to 255`,
                    button:"close"
                })
            }

            setLoading(false)
            setAddModal(false)
            setError(true)
        } else {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setLoading(false)
            setEditModal(false)
            setError(true)
        }
    }

    const submit_edit_room = async (e) => {
        setLoading(true)
        e.preventDefault()

        const room_id = current_room.room_id

        const name = e.target.name.value.trim()[0].toUpperCase() + e.target.name.value.trim().substring(1)

        const formData = new FormData()
        formData.append('id', room_id)
        formData.append('name', e.target.name.value.trim())
        formData.append('capacity', parseInt(e.target.capacity.value))

        const response = await edit_room(formData)

        if(response === true) {
            const is_name_different = name === current_room.name ? `The room ${name} has been edited successfully.` : `The room ${current_room.name} has been edited ${"to " + name} successfully.`

            setEditModal(false)
            setSuccess(true)
            setSuccess_text({
                title:`Edited successfully!`,
                message:is_name_different,
                button:"close"
            })
            load_rooms()
        } else if (response) {
            if (response === "empty") {
                setError_text({
                    title: `No name!`,
                    message: `You didn't enter any name!`,
                    button: "close"
                })
            } else if (response === "room exists") {
                setError_text({
                    title:`Name taken!`,
                    message:`The name ${name} already exists.`,
                    button:"close"
                })

            } else if (response === "NaN") {
                setError_text({
                    title:`Incorrect value!`,
                    message:`You didn't enter a correct value for the capacity.`,
                    button:"close"
                })
            } else if (response === "big") {
                setError_text({
                    title:`Too big!`,
                    message:`Please enter a capacity from 0 to 255`,
                    button:"close"
                })
            }
            setLoading(false)
            setEditModal(false)
            setError(true)
        } else {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setLoading(false)
            setEditModal(false)
            setError(true)
        }


    }

    const submit_delete_room = async (id, name) => {
        setLoading(true)
        const response = await delete_room(id)

        const formated_name = name[0].toUpperCase() + name.substring(1)

        if(response === true) {
            setEditModal(false)
            setSuccess(true)
            setSuccess_text({
                title:`Deleted successfully!`,
                message:`The room ${formated_name} has been deleted successfully.`,
                button:"close"
            })
            load_rooms()
        } else {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setLoading(false)
            setEditModal(false)
            setError(true)
        }

    }

    const open_edit_modal = async (id) => {
        setLoading(true)
        const room = await get_room(id)

        if(room) {
            setCurrentRoom(room)
            setLoading(false)
            setEditModal(true)
        } else {
            setError_text({
                title:"Error!",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setLoading(false)
            setError(true)
        }



    }


    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {loading ? <Loading/> : null}
            <Error_modal
                setError={setError}
                error={error}
                title={error_text.title}
                message={error_text.message}
                button={error_text.button}
            />
            <Success_modal
                success={success}
                setSuccess={setSuccess}
                title={success_text.title}
                message={success_text.message}
                button={success_text.button}
            />
            <Add_modal
                add_modal={addModal}
                setAddModal={setAddModal}
                submit_add_room={submit_add_room}
            />
            <Edit_modal
                editModal={editModal}
                setEditModal={setEditModal}
                submit_edit_room={submit_edit_room}
                submit_delete_room={submit_delete_room}
                current_room={current_room}
            />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Rooms</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the rooms and their capacity.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setAddModal(true)}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add room
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Capacity
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {rooms.length > 0 ? rooms.map((room) => (
                                <tr key={room.room_id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {room.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{room.capacity}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <div
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => {open_edit_modal(room.room_id)}}
                                        >
                                            Edit
                                        </div>
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

"use client"

import Modal_add_discipline from "./_modals/add_discipline_modal"
import Modal_edit_discipline from "./_modals/edit_discipline_modal"
import Success_modal from "../../../../_modals/success"
import Error_modal from "../../../../_modals/error"

import {useEffect, useState} from "react";

import {
    adding_discipline,
    deleting_discipline,
    editing_discipline,
    get_disciplines
} from "@/logic/management/Discipline";
import Loading from "@/app/_loading/loading";


export default function Example() {
    const [disciplines, setDisciplines] = useState(null)
    const [discipline, setDiscipline] = useState(null)

    const [add_modal, setAddModal] = useState(false)
    const [edit_modal, setEditModal] = useState(false)

    const [success_modal, setSuccessModal] = useState(false)
    const [success_modal_text, setSuccess_modal_text] = useState({
        title:"",
        message:"",
        button:""
    })

    const [error_modal, setErrorModal] = useState(false)
    const [error_modal_text, setError_modal_text] = useState({
        title:"",
        message:"",
        button:""
    })

    const [loading, setLoading] = useState(false)

    const load_disciplines = async () => {
        setLoading(true)
        const list = await get_disciplines()
        setDisciplines(list)
        setLoading(false)
    }

    const open_edit_modal = (discipline_data) => {
        setDiscipline(discipline_data)
        setEditModal(true)
    }

    const close_edit_modal = () => {
        setEditModal(false)
        setDiscipline(null)
        load_disciplines()

    }

    const submit_edit_discipline = async (e) => {
        e.preventDefault()

        setLoading(true)
        const formData = new FormData(e.target);

        formData.append("discipline_id", discipline.discipline_id)

        const response = await editing_discipline(formData);

        if(!response){
            setError_modal_text({
                title:"Error",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setEditModal(false)
            setErrorModal(true)
            setLoading(false)
            return
        }

        if(response === "empty") {
            setError_modal_text({
                title:`Empty field!`,
                message:`You didn't enter any name!`,
                button:"close"
            })
            setEditModal(false)
            setErrorModal(true)
            setLoading(false)
            return
        }

        const name = formData.get('name').trim()[0].toUpperCase() + formData.get('name').substring(1).trim().toLowerCase();

        setEditModal(false)

        if(response === "discipline exists") {
            setError_modal_text({
                title:`Duplicated activity!`,
                message:`${name} already exists.`,
                button:"close"
            })

            setErrorModal(true)
            setLoading(false)
            return
        }

        setSuccess_modal_text({
            title:`Edited successfully.`,
            message:`${name} has been edited successfully.`,
            button:"close"
        })

        setLoading(false)
        close_edit_modal()
        setSuccessModal(true)

        load_disciplines()
    }

    const submit_deleting_discipline = async (id, name) => {
        setLoading(true)
        const response = await deleting_discipline(id)

        if(!response){
            setError_modal_text({
                title:"Error",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setEditModal(false)
            setErrorModal(true)
            setLoading(false)
            return
        }



        setSuccess_modal_text({
            title:`Deleted successfully.`,
            message:`${name.trim()} has been deleted successfully.`,
            button:"close"
        })

        setLoading(false)
        close_edit_modal()
        setSuccessModal(true)

        load_disciplines()
    }

    const submit_add_discipline = async (e) => {
        e.preventDefault()

        setLoading(true)

        const formData = new FormData(e.target)

        const response = await adding_discipline(formData)


        if(!response){
            setError_modal_text({
                title:"Error",
                message:"An error occurred during the process. Please try again later.",
                button:"close"
            })
            setEditModal(false)
            setErrorModal(true)
            setLoading(false)
            return
        }

        if(response === "empty") {
            setError_modal_text({
                title:`Empty field!`,
                message:`You didn't enter any name!`,
                button:"close"
            })
            setAddModal(false)
            setErrorModal(true)
            setLoading(false)
            return
        }

        const name = formData.get('name').trim()[0].toUpperCase() + formData.get('name').substring(1).trim().toLowerCase();

        setAddModal(false)



        if(response === "discipline exists") {
            setError_modal_text({
                title:`Duplicated activity!`,
                message:`${name} already exists.`,
                button:"close"
            })

            setErrorModal(true)
            setLoading(false)
            return
        }

        setSuccess_modal_text({
            title:`Added successfully.`,
            message:`${name} has been added successfully.`,
            button:"close"
        })

        setLoading(false)
        setSuccessModal(true)
        load_disciplines()
    }

    useEffect(() => {
        load_disciplines()
    },[])
    return (
        <div className="px-4 sm:px-6 lg:px-8 h-full">
            {loading? <Loading/> : null}
            <Error_modal
                error={error_modal}
                setError={setErrorModal}
                title={error_modal_text.title}
                message={error_modal_text.message}
                button={error_modal_text.button}
            />
            <Success_modal
                success={success_modal}
                setSuccess={setSuccessModal}
                title={success_modal_text.title}
                message={success_modal_text.message}
                button={success_modal_text.button}
            />
            <Modal_add_discipline
                setAddModal={setAddModal}
                add_modal={add_modal}
                load_disciplines={load_disciplines}
                setSuccessModal={setSuccessModal}
                submit_add_discipline={submit_add_discipline}

            />
            <Modal_edit_discipline
                discipline={discipline}
                edit_modal={edit_modal}
                close_edit_modal={close_edit_modal}
                load_disciplines={load_disciplines}
                submit_edit_discipline={submit_edit_discipline}
                submit_deleting_discipline={submit_deleting_discipline}
            />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Disciplines</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the available disciplines.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => {setAddModal(true)}}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add discipline
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

                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {disciplines ? disciplines.map((discipline) => (
                                <tr key={discipline.discipline_id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {discipline.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <div
                                            className="text-indigo-600 hover:text-indigo-900 "
                                            onClick={() => {open_edit_modal(discipline)}}
                                        >
                                            <div className="cursor-pointer inline">
                                                Edit<span className="sr-only">, Edit</span>
                                            </div>

                                        </div>
                                    </td>
                                </tr>
                            )): null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

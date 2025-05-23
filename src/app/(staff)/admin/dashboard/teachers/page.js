"use client"

import Adding_drawers from "./_drawers/adding_drawers"
import Editing_drawers from "./_drawers/editing_drawers"
import Error_modal from "../../../../_modals/error"
import Success_modal from "../../../../_modals/success"
import Loading from "../../../../_loading/loading"
import {useState, useEffect, useRef} from 'react'

import {get_disciplines} from "@/logic/management/Discipline";
import {adding_teacher, editing_teacher, delete_teacher, get_teachers, get_teacher} from "@/logic/management/teachers";


export default function Example() {
    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);
    const [successText, setSuccessText] = useState({
        title:"",
        message:"",
        button:""
    });

    const [error, setError] = useState(false)

    const [edit_drawer, set_edit_drawer] = useState(false)
    const [current_teacher, set_current_teacher] = useState(null)
    const [edit_badge, set_edit_badge] = useState([])

    const [add_drawer, set_add_drawer] = useState(false)
    const [available_discipline, set_available_discipline] = useState([])

    const [teachers_list, set_teacher_list] = useState([])

    const [badge, setBadge] = useState([])

    const selected_discipline = useRef()
    const add_firstname = useRef()
    const add_lastname = useRef()
    const add_firstname_error = useRef()
    const add_lastname_error = useRef()



    const edit_selected_discipline = useRef()
    const edit_firstname = useRef()
    const edit_lastname = useRef()
    const edit_firstname_error = useRef()
    const edit_lastname_error = useRef()

    const load_teachers = async () => {
        if(!loading){
            setLoading(true)
        }

        const list = await get_teachers()

        if(list){
            set_teacher_list(list)
        }

        if(list === false){
            if(error === false){
                setError(true)
            }
        }


        if(!loading){
            setLoading(false)
        }
    }

    const open_edit_teacher_drawer = async(id) => {
        setLoading(true)
        const teacher = await get_teacher(id)
        if(teacher === false){
            setLoading(false)
            setError(true)
            return
        }
        const badges = teacher.disciplines ? teacher.disciplines.replace(`\\`,"").split("@").map(discipline => JSON.parse(discipline)) : []
        const disciplines = await get_disciplines()

        if(disciplines === false){
            setLoading(false)
            setError(true)
        } else {
            set_current_teacher(teacher)
            set_edit_badge(badges)
            set_available_discipline(disciplines)
            setLoading(false)
            set_edit_drawer(true)
        }
    }

    const close_edit_teacher_drawer = () => {
        set_available_discipline([])
        set_current_teacher(null)
        reset_field_edit(false)
    }


    const reset_field_edit = () => {
        edit_firstname.current.value = "";
        edit_lastname.current.value = "";
        set_edit_badge([])
        set_edit_drawer(false)
    }


    const open_add_teacher_drawer = async() => {
        setLoading(true)
        const disciplines = await get_disciplines()

        if(disciplines === false){
            setLoading(false)
            setError(true)
        } else {
            set_available_discipline(disciplines)
            setLoading(false)
            set_add_drawer(true)
        }
    }

    const close_add_teacher_drawer = () => {
        set_available_discipline([])
        setBadge([])
        set_add_drawer(false)
    }

    const delete_submit = async () => {
        setLoading(true)

        const response = await delete_teacher(current_teacher.teacher_id)

        if(response === true) {
            reset_field_edit()
            setSuccess(true)
            setSuccessText({
                title:`Teacher deleted successfully!`,
                message:`The teacher ${current_teacher.firstname} ${current_teacher.lastname} has been deleted successfully.`,
                button:"close",
            })

            load_teachers()
        } else {
            setLoading(false)
            setError(true)

        }



    }


    const adding_badge_edit = () => {
        const id = edit_selected_discipline.current.value


        if (parseInt(id) === -1) return

        console.log(edit_badge)
        const discipline = available_discipline.find((item) => item.discipline_id === parseInt(id))

        const new_list = edit_badge.concat([{
            discipline_id: parseInt(id),
            name: discipline.name,
        }])


        set_edit_badge(new_list)
    }

    const remove_badge_edit = (id) => {
        console.log("remove discipline", id)
        console.log(edit_badge)
        const new_badge = edit_badge.filter((item) => item.discipline_id !== id)

        set_edit_badge(new_badge)
    }

    const edit_submit = async () => {
        setLoading(true)
        reset_errors({firstname: edit_firstname, firstname_error:edit_firstname_error, lastname: edit_lastname, lastname_error:edit_lastname_error})

        const formData = new FormData()
        console.log(current_teacher.teacher_id)
        formData.append('teacher_id', current_teacher.teacher_id)
        formData.append('firstname', edit_firstname.current.value)
        formData.append('lastname', edit_lastname.current.value)
        formData.append('badges', edit_badge.map((item) => item.discipline_id))

        const response = await editing_teacher(formData)

        if(response === true) {
            reset_field_edit()
            setSuccess(true)
            setSuccessText({
                title:`Teacher edited successfully!`,
                message:`The teacher ${current_teacher.firstname} ${current_teacher.lastname} has been edited successfully.`,
                button:"close",
            })
            load_teachers()
        } else if(
            isEmpty(
                response,
                {firstname: edit_firstname, firstname_error:edit_firstname_error, lastname: edit_lastname, lastname_error:edit_lastname_error},
                "This field is empty!"
            )
        ) {
            setLoading(false)
            return false
        }



    }

    const adding_badge = () => {
        const id = selected_discipline.current.value

        if (parseInt(id) === -1) return

        console.log("adding discipline", id)
        const discipline = available_discipline.find((item) => item.discipline_id === parseInt(id))

        const new_list = badge.concat([{
            id: parseInt(id),
            name: discipline.name,
        }])

        console.log(new_list)
        setBadge(new_list)
    }

    const remove_badge = (id) => {
        console.log("remove discipline", id)
        console.log(badge)
        const new_badge = badge.filter((item) => item.id !== id)

        setBadge(new_badge)
    }

    const add_submit = async () => {
        setLoading(true)
        reset_errors({firstname: add_firstname,firstname_error: add_firstname_error, lastname: add_lastname, lastname_error: add_lastname_error})

        const formData = new FormData()

        const firstname = add_firstname.current.value.trim()[0].toUpperCase() + add_firstname.current.value.substring(1).trim().toLowerCase();
        const lastname = add_lastname.current.value.trim()[0].toUpperCase() + add_lastname.current.value.substring(1).trim().toLowerCase();

        formData.append('firstname', add_firstname.current.value)
        formData.append('lastname', add_lastname.current.value)
        formData.append('badges', badge.map((item) => item.id))

        const response = await adding_teacher(formData)

        if(response === true) {
            reset_field_add()
            setSuccess(true)
            setSuccessText({
                title:`Teacher added successfully!`,
                message:`The teacher ${firstname} ${lastname} has been added successfully.`,
                button:"close",
            })
            load_teachers()
        } else if(
            isEmpty(
                response,
                {firstname: add_firstname,firstname_error: add_firstname_error, lastname: add_lastname, lastname_error: add_lastname_error},
                "This field is empty!"
            )
        ) {
            return false
        }

        setLoading(false)
    }

    const reset_errors = (tag) => {
        tag.firstname.current.classList.remove("focus:outline-red-600");
        tag.firstname.current.classList.add("focus:outline-indigo-600");
        tag.firstname_error.current.innerHTML = "&nbsp;";

        tag.lastname.current.classList.remove("focus:outline-red-600");
        tag.lastname.current.classList.add("focus:outline-indigo-600");
        tag.lastname_error.current.innerHTML = "&nbsp;";
    }

    const isEmpty = (response,tag, message) => {
        switch (response) {
            case "firstname":
                error_ui(tag.firstname, tag.firstname_error, message)
                return true

            case "lastname":
                error_ui(tag.lastname, tag.lastname_error, message)
                return true
        }

        return false
    }

    const error_ui = (tag, error_tag, message) => {
        error_tag.current.innerHTML = message;
        tag.current.classList.remove("focus:outline-indigo-600");
        tag.current.classList.add("focus:outline-red-600");
        tag.current.focus()
    }

    const reset_field_add = () => {
        add_firstname.current.value = "";
        add_lastname.current.value = "";
        setBadge([])
        set_add_drawer(false)
    }

    useEffect(() => {
        load_teachers()
    },[])

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {loading ? <Loading/> : null}
            <Error_modal
                error={error}
                setError={setError}
                title="Error"
                message="An error occurred during the process. Please try again later."
                button="close"
            />
            <Success_modal
                success={success}
                setSuccess={setSuccess}
                title={successText.title}
                message={successText.message}
                button={successText.button}
            />
            <Editing_drawers
                current_teacher={current_teacher}
                edit_drawer={edit_drawer}
                set_edit_drawer={set_edit_drawer}
                edit_firstname={edit_firstname}
                edit_lastname={edit_lastname}
                edit_firstname_error={edit_firstname_error}
                edit_lastname_error={edit_lastname_error}
                selected_discipline={edit_selected_discipline}
                available_discipline={available_discipline}
                badge={edit_badge}
                adding_badge={adding_badge_edit}
                remove_badge={remove_badge_edit}
                open_edit_teacher_drawer={open_edit_teacher_drawer}
                close_edit_teacher_drawer={close_edit_teacher_drawer}
                edit_submit={edit_submit}
                delete_submit={delete_submit}
            />
            <Adding_drawers
                add_drawer={add_drawer}
                available_discipline={available_discipline}
                close_add_teacher_drawer={close_add_teacher_drawer}
                adding_badge={adding_badge}
                remove_badge={remove_badge}
                badge={badge}
                add_firstname={add_firstname}
                add_lastname={add_lastname}
                add_firstname_error={add_firstname_error}
                add_lastname_error={add_lastname_error}
                selected_discipline={selected_discipline}
                add_submit={add_submit}
            />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Teachers</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {`A list of all the teachers and the discipline they're currently teaching.`}
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => open_add_teacher_drawer()}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add teacher
                    </button>
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
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">join</span>
                                </th>
                            </tr>
                            </thead>
                            {teachers_list.length > 0 ? teachers_list.map((teacher) => (
                                <tbody key={teacher.teacher_id} className="divide-y divide-gray-200 ">
                                <tr className={"bg-gray-500"}>
                                    <td className="whitespace-nowrap mx-8 py-4 pl-4 pr-3 font-bold text-sm  text-white">
                                        {teacher.lastname +" "+ teacher.firstname}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium px-8">
                                        <button
                                            type="button"
                                            onClick={() => {open_edit_teacher_drawer(teacher.teacher_id)}}
                                            className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                                {teacher.disciplines  ? teacher.disciplines.split(",").map((discipline) => (
                                    <tr key={discipline} className={"bg-gray-100"}>
                                        <td className="whitespace-nowrap mx-8 py-4 pl-4 pr-3 font-medium text-sm text-black">
                                            {discipline}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 px-8 pr-4 text-right text-sm font-medium">

                                        </td>
                                    </tr>
                                )) : (
                                    <tr className={"bg-gray-100"}>
                                        <td className="whitespace-nowrap mx-8 py-4 pl-4 pr-3 font-medium text-sm text-black">
                                            No Disciplines
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 px-8 text-right text-sm font-medium">

                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            )): null}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

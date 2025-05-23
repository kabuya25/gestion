"use client"

import Success from "@/app/_modals/success"
import Error from "@/app/_modals/error"

import Add_drawer from "./_drawers/add_drawer"
import Edit_drawer from "./_drawers/edit_drawer"
import Loading from "../../../../_loading/loading"

import {useState, useEffect} from "react"
import {
    add_class,
    check_enough_data,
    delete_class,
    edit_class,
    get_class,
    get_classes
} from "@/logic/management/classes";
import {get_discipline_list_teacher} from "@/logic/management/Discipline"

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

    const [adding_drawer, setAddDrawer] = useState(false)
    const [edit_drawer, setEditDrawer] = useState(false)

    const [current_time, setCurrentTime] = useState(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))

    const [add_list_rooms, setAdd_list_rooms] = useState([])
    const [add_list_teachers, setAdd_list_teachers] = useState([])
    const [add_list_disciplines, setAdd_list_disciplines] = useState([])
    const [is_add_selected_discipline, setIsAddSelectedDiscipline] = useState(false)

    const [edit_selected_class, setEditSelectedClass] = useState({})
    const [edit_list_rooms, setEdit_list_rooms] = useState([])
    const [edit_list_teachers, setEdit_list_teachers] = useState([])
    const [edit_list_disciplines, setEdit_list_disciplines] = useState([])
    const [is_edit_selected_discipline, setIsEditSelectedDiscipline] = useState(false)

    const load_classes = async () => {
        setLoading(true)
        const response = await get_classes()

        if(response){
            setClasses_list(response)
        }


        setLoading(false)
    }

    const open_edit_drawer = async (id) => {
        const response = await get_class(id)

        if(response) {
            setEditSelectedClass(response.selected_data)
            setEdit_list_rooms(response.possible_data.available_rooms)
            setEdit_list_disciplines(response.possible_data.disciplines)
            setIsEditSelectedDiscipline(true)
            setEdit_list_teachers(response.possible_data.possible_classes)
            setEditDrawer(true)
        }


    }

    const open_adding_drawer = async() => {
        const response = await check_enough_data()
            if(response === "no room") {
                console.log("no room found")
            } else if(response === "no classes"){
                console.log("no classes found")
            } else if (response) {
                setCurrentTime(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))
                setAdd_list_rooms(response.available_rooms)
                setAdd_list_teachers(response.possible_classes)
                setAddDrawer(true)
            }

    }

    const close_editing_drawer = () => {
        setEditDrawer(false)
        setEdit_list_rooms([])
        setEdit_list_teachers([])
        setEdit_list_disciplines([])
    }

    const close_adding_drawer = () => {
        setAddDrawer(false)
        setAdd_list_rooms([])
        setAdd_list_teachers([])
        setAdd_list_disciplines([])
    }

    const editing_update_disciplines = async(id) => {
        if(id < 0){
            console.log(id)
            setEdit_list_disciplines([])
            return
        }

        const response = await get_discipline_list_teacher(id)

        if (response) {
            setEdit_list_disciplines(response)
        }
    }

    const adding_update_disciplines = async(id) => {
        if(id < 0){
            console.log(id)
            setAdd_list_disciplines([])
            return
        }

        const response = await get_discipline_list_teacher(id)

        if (response) {
            setAdd_list_disciplines(response)
        }
    }

    const adding_submit = async(e) => {
        setLoading(true)
        e.preventDefault()

        const formdata = new FormData()

        formdata.append("room_id", e.target.room.value)
        formdata.append("teacher_id", e.target.teacher.value)
        formdata.append("discipline_id", e.target.discipline.value)
        formdata.append("datetime", new Date(e.target.date.value).getTime())
        formdata.append("length", e.target.length.value)


        const response = await add_class(formdata)

        if(response === true) {
            close_adding_drawer()
            load_classes()
            setSuccess_text({
                title:"Added successfully!",
                message:"The class has been added successfully!",
                button:"Close",
            })
            setSuccess(true)
        } else if(response === "invalid") {
            setError_text({
                title:"Invalid value!",
                message:"Some of the values are not valid!",
                button:"Close",
            })
            setError(true)
        } else if(response === "overlap") {
            setError_text({
                title:"Overlaping room!",
                message:"The room you selected is already taken for the time range selected",
                button:"Close",
            })
            setError(true)
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

    const editing_submit = async(e) => {
        setLoading(true)
        e.preventDefault()

        const formdata = new FormData()

        formdata.append("class_id", edit_selected_class.class_id)
        formdata.append("room_id", e.target.room.value)
        formdata.append("teacher_id", e.target.teacher.value)
        formdata.append("discipline_id", e.target.discipline.value)
        formdata.append("datetime", new Date(e.target.date.value).getTime())
        formdata.append("length", e.target.length.value)


        const response = await edit_class(formdata)

        if(response === true) {
            close_editing_drawer()
            load_classes()
            setSuccess_text({
                title:"Edited successfully!",
                message:"The class has been edited successfully!",
                button:"Close",
            })
            setSuccess(true)
        } else if(response === "invalid") {
            setError_text({
                title:"Invalid value!",
                message:"Some of the values are not valid!",
                button:"Close",
            })
            setError(true)
        } else if(response === "overlap") {
            setError_text({
                title:"Overlaping room!",
                message:"The room you selected is already taken for the time range selected",
                button:"Close",
            })
            setError(true)
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

    const delete_submit = async(id) => {
        setLoading(true)
        const response = await delete_class(id)

        if(response === true) {
            setEditDrawer(false)

            setSuccess_text({
                title:"Deleted successfully!",
                message:"The class has been deleted successfully!",
                button:"Close",
            })
            await load_classes()
            setSuccess(true)

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
            <Add_drawer
                setAddDrawer={setAddDrawer}
                close_adding_drawer={close_adding_drawer}
                adding_drawer={adding_drawer}
                add_list_rooms={add_list_rooms}
                setAdd_list_rooms={setAdd_list_rooms}
                add_list_teachers={add_list_teachers}
                adding_update_disciplines={adding_update_disciplines}
                add_list_disciplines={add_list_disciplines}
                setIsAddSelectedDiscipline={setIsAddSelectedDiscipline}
                is_add_selected_discipline={is_add_selected_discipline}
                adding_submit={adding_submit}
                current_time={current_time}
            />
            <Edit_drawer

                edit_selected_class={edit_selected_class}
                setEditDrawer={setEditDrawer}
                close_editing_drawer={close_editing_drawer}
                edit_drawer={edit_drawer}
                edit_list_rooms={edit_list_rooms}
                setEdit_list_rooms={setEdit_list_rooms}
                edit_list_teachers={edit_list_teachers}
                editing_update_disciplines={editing_update_disciplines}
                edit_list_disciplines={edit_list_disciplines}
                setIsEditSelectedDiscipline={setIsEditSelectedDiscipline}
                is_edit_selected_discipline={is_edit_selected_discipline}
                editing_submit={editing_submit}
                delete_submit={delete_submit}
                current_time={current_time}
            />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Classes</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the available classes.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={open_adding_drawer}
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add class
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
                                    Start at
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    End at
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    discipline
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    teacher
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    room
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
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <div
                                            className="text-indigo-600 hover:text-indigo-900"
                                            onClick={() => open_edit_drawer(clas.class_id)}
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

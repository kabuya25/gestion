'use client'

import { useState} from 'react'
import {usePathname, useRouter} from 'next/navigation';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    CalendarIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import Loading from "@/app/_loading/loading"
import {admin_sign_off} from "@/logic/account/login";



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example({children}) {
    const router = useRouter()
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const navigation = [
        { name: 'Classes', href: '/admin/dashboard/classes', icon: CalendarIcon, current: pathname === '/admin/dashboard/classes'},
        { name: 'Teachers', href: '/admin/dashboard/teachers', icon: UsersIcon, current: pathname === '/admin/dashboard/teachers' },
        { name: 'Disciplines', href: '/admin/dashboard/discipline', icon: FolderIcon, current: pathname === '/admin/dashboard/discipline' },
        { name: 'Rooms', href: '/admin/dashboard/rooms', icon: HomeIcon, current: pathname === '/admin/dashboard/rooms' },
    ]

    const signing_off = async () => {
        setLoading(true)
        const response = await admin_sign_off();

        if (response === true) {
            router.push('/admin/login')
        } else {
            console.log("error")
            setLoading(false)
        }
    }

    return (
        <>
            {loading ? <Loading /> : null}
            <div className={"bg-white"}>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-2">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        alt="Your Company"
                                        src={`/white_logo_transparent_background.png`}
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <a
                                                            onClick={() => updateMenu(item.name)}
                                                            href={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-indigo-700 text-white'
                                                                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                                                    'size-6 shrink-0',
                                                                )}
                                                            />
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))}
                                                <li key={-1}>
                                                    <div
                                                        onClick={signing_off}
                                                        className={'text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'}
                                                    >
                                                        <ArrowRightOnRectangleIcon
                                                            aria-hidden="true"
                                                            className={'text-white text-indigo-200 group-hover:text-white size-6 shrink-0 '}
                                                        />
                                                        Sign out
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
                        <div className="flex h-16 shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src={`/white_logo_transparent_background.png`}
                                className="h-8 w-auto"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    // onClick={() => updateMenu(item.name)}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-indigo-700 text-white'
                                                            : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                                            'size-6 shrink-0',
                                                        )}
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                        <li key={-1}>
                                            <div
                                                onClick={signing_off}
                                                className={'text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'}
                                            >
                                                <ArrowRightOnRectangleIcon
                                                    aria-hidden="true"
                                                    className={'text-white text-indigo-200 group-hover:text-white size-6 shrink-0 '}
                                                />
                                                Sign out
                                            </div>
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        </nav>
                    </div>
                </div>

                <div
                    className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <button type="button" onClick={() => setSidebarOpen(true)}
                            className="-m-2.5 p-2.5 text-indigo-200 lg:hidden">
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon aria-hidden="true" className="size-6"/>
                    </button>
                    <div className="flex-1 text-sm/6 font-semibold text-white">Dashboard</div>

                </div>

                <main className="py-10 lg:pl-72 min-h-screen">
                    <div className="px-4 sm:px-6 lg:px-8 ">{children}</div>
                </main>
            </div>
        </>
    )
}

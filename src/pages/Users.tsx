import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { getAlluser } from "../api/api";
import type { getUsersResponse } from "../api/apiTypes";
import Pagination from "../utils/Pagination";


export default function UserTable() {
    const [users, setUsers] = useState<getUsersResponse["userData"]>([]);
    const [paginationState, setpaginationState] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 10
    })


    const editUser = (index: number) => {
        console.log("Edit user:", users[index]);
        // You can open a modal or perform edit logic here
    };
    const getUsersFunction = async () => {
        let payload = {page:paginationState.page,pageSize:paginationState.pageSize}
        let userDataFetch = await getAlluser(payload)
        setpaginationState({
            page:userDataFetch.skip,
            pageSize:userDataFetch.pageSize,
            totalCount:userDataFetch.totalCount
        })
        setUsers(userDataFetch.userData)
    }
    const pageSizeChange =(data:any)=>{
        console.log(data,"pageSizeChange")
        setpaginationState((state)=>{return{...state,pageSize:data}})
    }
    const pagechange =(data:any)=>{
        console.log(data,"pageChange")
        setpaginationState((state)=>{return{...state,page:data}})
    }
    useEffect(() => {
        getUsersFunction()
    }, [])

    return (
        <div className="p-6 bg-background min-h-screen">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Gender</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{user.id}</td>
                                <td className="px-4 py-2 border-b">{user.name}</td>
                                <td className="px-4 py-2 border-b">{user.email}</td>
                                <td className="px-4 py-2 border-b">{user.gender}</td>
                                <td className="px-4 py-2 border-b">{user.status}</td>
                                <td className="px-4 py-2 border-b flex gap-2">
                                    <button onClick={() => editUser(index)} className="text-blue-500">
                                        <FaRegEdit />
                                    </button>
                                    <button onClick={() => { }} className="text-red-500">
                                        <MdOutlineCancel />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                page={paginationState.page}
                pageSize={paginationState.pageSize}
                totalCount={paginationState.totalCount}
                onPageChange={pagechange}
                onPageSizeChange={pageSizeChange}
            />
        </div>
    );
}

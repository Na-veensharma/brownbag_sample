import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, collection, addDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

import { auth, db } from '../../Firebase/Firebase';

import logo from '../../Assets/clean.svg';
import deleteIcon from '../../Assets/delete.svg';
import Loader from '../Loader';

const Main = () => {

    const user = auth.currentUser;

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "list"), (snapShot) => {
            setTaskList(snapShot.docs.map(doc => { return { ...doc.data(), id: doc.id } }));
            setLoading(false);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    const [loading, setLoading] = useState(true);

    // status: pending | finished
    const [taskList, setTaskList] = useState(undefined);
    const [activeTask, setActiveTask] = useState(undefined);
    const [taskInput, setTaskInput] = useState("");

    const logoutHandler = () => {
        signOut(auth);
    }

    const newTaskHandler = () => {
        addDoc(collection(db, "list"), { title: taskInput, status: "pending", finishedBy: user.email === "test@test.com" ? "Naveen" : user.email });
        setTaskInput("");
    }

    const taskCompleteHandler = (taskId) => {
        updateDoc(doc(db, "list", taskId), {
            status: "finished"
        })
        setActiveTask(undefined);
    }

    const deleteTaskHandler = (taskId) => {
        deleteDoc(doc(db, "list", taskId));
        setActiveTask(undefined);
    }

    return (
        !taskList || loading ?
            <Loader />
            :
            <div className="w-full flex items-center flex-col px-4 py-6">
                <header className="flex justify-between items-center w-full">
                    <span className="rounded-full highlightBGColor overflow-hidden p-2 flex items-center justify-center border border-white"><img alt="" src={logo} className="h-14" /></span>
                    <button
                        className="text-white bg-red-500 shadow-lg h-10 hover:shadow-xl hover:bg-red-600 text-lg rounded px-10"
                        onClick={logoutHandler}
                    >
                        Logout
                    </button>
                </header>
                <section className='secondaryBGColor rounded px-6 py-4 w-full md:w-1/2 lg:w-1/3 mt-20'>
                    <h3 className='text-center font-semibold text-xl text-gray-600 relative'>Add another task</h3>
                    <div className='flex items-center justify-center'>
                        <input className='w-full outline-none text-black rounded py-2 px-4 my-4' value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
                        <button onClick={newTaskHandler} disabled={taskInput === ""} className={`w-10 h-10 rounded ml-2 ${taskInput === "" ? "bg-gray-500 cursor-not-allowed" : "highlightBGColor"}`}>+</button>
                    </div>
                </section >
                <section className='secondaryBGColor rounded px-6 py-4 w-full md:w-1/2 lg:w-1/3 my-6'>
                    <h3 className='text-center font-semibold text-xl text-gray-600 relative'>
                        {activeTask ?
                            <>
                                <span onClick={() => setActiveTask(undefined)} className='absolute left-0 cursor-pointer'>{"<---"}</span>
                                {activeTask.title}
                                { activeTask.status === "finished" && <img alt="" onClick={() => deleteTaskHandler(activeTask.id)} src={deleteIcon} className='absolute right-0 cursor-pointer h-6 top-0' /> }
                            </> : "Task List"}
                    </h3>
                    {
                        activeTask ?
                            <div>
                                {
                                    activeTask.status === "pending" ?
                                        <button onClick={() => taskCompleteHandler(activeTask.id)} className='border shadow-lg hover:shadow-xl py-2 w-full highlightBGColor rounded mt-6'>Completed</button>
                                        :
                                        <p className='text-gray-600 mt-6 text-center border-t-2 border-gray-500 mx-8 pt-6'><span className='font-semibold'>You can reward/blame: </span>{activeTask.finishedBy}</p>
                                }
                            </div>
                            :
                            <ul className="max-h-72 overflow-auto">
                                {
                                    taskList.sort((task1, task2) => {
                                        if (task1.status === "pending" && task2.status !== "pending") {
                                            return -1;
                                        } else if (task1.status !== "pending" && task2.status === "pending") {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }).map((task) => (
                                        <li
                                            key={task.id}
                                            onClick={() => setActiveTask(task)}
                                            className={`my-2 rounded py-2 px-4 font-semibold text-center cursor-pointer border-2 ${task.status === "finished" ? "bg-gray-500 line-through" : "highlightBGColor"}`}>{task.title}</li>
                                    ))
                                }
                            </ul>
                    }

                </section>
            </div >
    )
}

export default Main;
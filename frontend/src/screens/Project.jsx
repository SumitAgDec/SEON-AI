import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios.js";
import {
  initilizeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket.js";
import { UserContext } from "../context/user.context.jsx";

function Project({ state }) {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    initilizeSocket(project._id);

    receiveMessage("project-message", (data) => {
      console.log(data);
    });

    axios
      .get(`projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
      })
      .catch((err) => {
        console.log("Error !", err.message);
      });

    axios
      .get("api/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log("Error !", err.message);
      });
  }, []);

  const handleUserClick = (userId) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(userId)) {
        newSelectedUserId.delete(userId);
      } else {
        newSelectedUserId.add(userId);
      }
      return newSelectedUserId;
    });
    // setIsModalOpen(false);
  };

  function addCollaborators() {
    axios
      .put("projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log("Error !", err.message);
      });
  }

  function send() {
    console.log(user);
    sendMessage("project-message", {
      message,
      sender: user._id,
    });

    setMessage("");
  }

  // console.log(location.state);
  return (
    <main className="h-screen w-full flex">
      <section className="left flex flex-col h-full min-w-96 bg-slate-300 relative">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100">
          <button className="flex gap-2 " onClick={() => setIsModalOpen(true)}>
            <i className="ri-add-large-fill mr-1"></i>
            Add collaborators
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 "
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex-grow flex flex-col">
          <div className="message-box p-1 flex-grow flex flex-col gap-1">
            <div className="message max-w-56 flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-sm">example@gamil.com</small>
              <p className="text-sm">Lorem ipsum dolor sit amet.</p>
            </div>
            <div className="ml-auto max-w-56 message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
              <small className="opacity-65 text-sm">example@gamil.com</small>
              <p className="text-sm">Lorem ipsum dolor sit amet.</p>
            </div>
          </div>

          <div className="inputField w-full flex ">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 border-none outline-none flex-grow"
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send} className="px-5 bg-slate-950 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center p-4 px-3 w-full bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
              <i className="ri-close-fill"></i>
            </button>
          </header>

          {project.users &&
            project.users.map((user) => {
              return (
                <div className="users flex flex-col gap-2 cursor-pointer hover:bg-slate-200 p-2 ">
                  <div className="user flex gap-2 items-center">
                    <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-4 text-white bg-slate-600">
                      <i className="ri-user-fill absolute"></i>
                    </div>

                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="flex flex-col gap-2 mb-16 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user flex gap-2 items-center p-2 cursor-pointer hover:bg-slate-200 ${
                    Array.from(selectedUserId).indexOf(user._id) !== -1
                      ? "bg-slate-200"
                      : ""
                  }`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-4 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>
            <button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={addCollaborators}
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Project;
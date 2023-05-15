import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserBio, setNewUserBio] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserBio, setEditUserBio] = useState("");

  useEffect(() => {
    fetch("http://localhost:9000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  const deleteUser = (id) => {
    fetch(`http://localhost:9000/api/users/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((deletedUser) => {
        setUsers(users.filter((user) => user.id !== deletedUser.id));
      })
      .catch((error) => console.error(error));
  };

  const newUserAdd = (e) => {
    e.preventDefault();
    if (newUserName && newUserBio) {
      const newUser = { name: newUserName, bio: newUserBio };
      fetch("http://localhost:9000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          setNewUserName("");
          setNewUserBio("");
        })
        .catch((error) => console.error(error));
    }
  };

  const saveEdit = () => {
    if (editUserName && editUserBio && editingUser) {
      const updatedUser = {
        id: editingUser.id,
        name: editUserName,
        bio: editUserBio,
      };

      fetch(`http://localhost:9000/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedUsers = users.map((user) =>
            user.id === data.id ? data : user
          );
          setUsers(updatedUsers);
          cancelEdit();
        })
        .catch((error) => console.error(error));
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserBio(user.bio);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditUserName("");
    setEditUserBio("");
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <ul className="users">
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.bio}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            <button onClick={() => editUser(user)}>Edit</button>
          </li>
        ))}
      </ul>
      {editingUser ? (
        <div>
          <h2>Edit User</h2>
          <input
            type="text"
            placeholder="Name"
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio"
            value={editUserBio}
            onChange={(e) => setEditUserBio(e.target.value)}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      ) : (
        <form onSubmit={newUserAdd}>
          <h2>Add User</h2>
          <input
            type="text"
            placeholder="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio"
            value={newUserBio}
            onChange={(e) => setNewUserBio(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default App;

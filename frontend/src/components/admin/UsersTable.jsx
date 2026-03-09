import { useState, useEffect } from "react";
export default function UsersTable() {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null)
    const fetchUsers = async () => {
        // Allows server to identify user
        try {
            setLoading(true)
        const res = await fetch("http://localhost:4000/users", {method: "GET", headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }});
        const data = await res.json()
        setUsers(data.users)
        setLoading(false)
        } catch {
            setErr("Error fetching username")
            setLoading(false)}
        
    };
    
    useEffect(() => {fetchUsers()}, []);
    if (loading) {
        return (<div>
            <h1>Loading...</h1>
            </div>)
    }
    if (err) {
        return (<h1>{err}</h1>)
    }

    return(
        <>
        <table>
        <tr>
          <th>Username</th> <th>Role</th>
        </tr>
        {users.map(user => (<tr>
            <td>{user.username}</td>
            <td>{user.role}</td>
            </tr>))}

      </table>
        </>
    )
}
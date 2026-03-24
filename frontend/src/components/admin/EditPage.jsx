import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

export default function EditPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Define all logic/hooks first
  const fetchUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      return navigate("/login");
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/me", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const userData = await res.json();
      setUser(userData);
    } catch {
      setErr("Error fetching user data");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/${type}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const result = await res.json();

      if (Array.isArray(result)) setData(result);
      else if (Array.isArray(result.users)) setData(result.users);
      else if (Array.isArray(result.products)) setData(result.products);
      else if (Array.isArray(result.data)) setData(result.data);
      else setData([]);
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  }, [type]);

  // 2. Run Effects
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    // Only fetch data if the user is verified as an ADMIN
    if (user?.role === "ADMIN") {
      fetchData();
    }
  }, [fetchData, user]);

  async function deleteItem(id) {
    const dialog = document.getElementById('confirmDialog');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
  
    // Open the styled modal
    dialog.showModal();
  
    const confirmed = await new Promise((resolve) => {
      confirmBtn.onclick = () => { dialog.close(); resolve(true); };
      cancelBtn.onclick = () => { dialog.close(); resolve(false); };
    });
  
    if (!confirmed) return;
  
    try {
      await fetch(`http://localhost:4000/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      fetchData(); 
    } catch (error) {
      alert("Delete failed");
    }
  }

  if (loading) return <h1>Loading...</h1>;
  if (err) return <h1>{err}</h1>;
  if (!user || user.role !== "ADMIN") return <h1>Access denied.</h1>;

  return (
    <div className="edit-page">
      <div className="admin-header">
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
      <h1>Edit {type}</h1>
      <table>
        <thead>
          <tr>
            {type === "users" ? (
              <><th>Username</th><th>Balance</th><th>Action</th></>
            ) : (
              <><th>Product</th><th>Price</th><th>Action</th></>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {type === "users" ? (
                <><td>{item.username}</td><td>£{item.balance}</td></>
              ) : (
                <><td>{item.title}</td><td>£{item.price}</td></>
              )}
              <td>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <dialog id="confirmDialog" class="custom-modal">
        <div class="modal-content">
          <h3>Are you sure?</h3>
          <p>This action cannot be undone.</p>
          <div class="modal-buttons" style={{display: "flex",
            gap: "20px"}}>
            <button id="cancelBtn" class="btn-secondary">Cancel</button>
            <button id="confirmBtn" class="btn-danger">Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

export default function EditPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
  
    const approveApplication = async (id) => {
      try {
        const res = await fetch(
          `http://localhost:4000/producerApplications/${id}/approve`,
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        const result = await res.json();

        if (res.ok) {
          alert("Application approved");
          fetchData();
        } else {
          alert(result.error);
        }

      } catch (error) {
        console.error(error);
        alert("Failed to approve application");
      }
    };

const fetchData = useCallback(async () => {
  try {
    console.log("Fetching:", type);

    const res = await fetch(`http://localhost:4000/${type}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      console.log("Route error:", res.status);
      setData([]);
      return;
    }

    const result = await res.json();
    console.log("API RESULT:", result);

    // if backend returns array
    if (Array.isArray(result)) {
      setData(result);
      return;
    }

    // if backend returns object
    setData(
      result.users ||
      result.products ||
      result.messages ||
      result.applications ||
      result.data ||
      []
    );

  } catch (error) {
    console.error("Fetch data error:", error);
    setData([]);
  }
}, [type]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (
  user?.role === "ADMIN" ||
  (user?.role === "PRODUCER" && type === "products")
) {
      fetchData();
    }
  }, [fetchData, user, type]);

  async function deleteItem(id) {
    const dialog = document.getElementById('confirmDialog');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
  
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
    } catch {
      alert("Delete failed");
    }
  }
  function handleChange(e) {
  setEditForm({
    ...editForm,
    [e.target.name]: e.target.value
  });
}

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm(item);
    }

    if (loading) return <h1>Loading...</h1>;
    if (err) return <h1>{err}</h1>;
    if (!user) return <h1>Access denied.</h1>;
    
    if (user.role === "PRODUCER" && type !== "products") {
      return <h1>Access denied.</h1>;
    }
    
    if (user.role !== "ADMIN" && user.role !== "PRODUCER") {
      return <h1>Access denied.</h1>;
    }

  async function saveEdit() {
  try {
    await fetch(`http://localhost:4000/${type}/${editingId}`, {
      method: "PUT", // or PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(editForm)
    });

    setEditingId(null);
    fetchData();

  } catch {
    alert("Update failed");
  }
}

  return (
    <div className="edit-page">
      <div className="admin-header">
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
      <h1>
        {user.role === "PRODUCER"
          ? "Edit My Products"
          : `Edit ${type}`}
      </h1>
      <table>
        <thead>
          <tr>
            {type === "users" ? (
                <><th>Email</th><th>Balance</th><th>Action</th></>
              ) : type === "contact-messages" ? (
                <><th>Email</th><th>Message</th><th>Date</th><th>Action</th></>
              ) : type === "producerApplications" ? (
                  <>
                    <th>Email</th><th>Producer Name</th><th>Address</th>
                    <th>Description</th><th>Status</th><th>Action</th>
                  </>
                ) : (
                <><th>Product</th><th>Price</th><th>Stock</th><th>Description</th><th>Action</th></>
              )}
          </tr>
        </thead>
    <tbody>
      {data.map(item => (
        <tr key={item.id}>

          {editingId === item.id ? (

            type === "users" ? (
              <>
                <td>
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    name="balance"
                    value={editForm.balance}
                    onChange={handleChange}
                  />
                </td>
              </>
            )

            : type === "contact-messages" ? (
              <>
                <td>
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    name="text"
                    value={editForm.text}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    name="date"
                    value={editForm.date}
                    onChange={handleChange}
                  />
                </td>
              </>
            )

            : type === "products" ? (
              <>
                <td>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    name="price"
                    value={editForm.price}
                    onChange={handleChange}
                  />
                </td>
                
                <td>
                  <input
                    name="stock"
                    value={editForm.stock}
                    onChange={handleChange}
                  />
                </td>

                <td>
                  <input
                    name="description"
                    value={editForm.description}
                    onChange={handleChange}
                  />
                </td>
              </>
            )

            : null

          ) : (

            type === "users" ? (
              <>
                <td>{item.email}</td>
                <td>£{item.balance}</td>
              </>
            )

            : type === "contact-messages" ? (
              <>
                <td>{item.email}</td>
                <td>{item.text}</td>
                <td>{item.date}</td>
              </>
            )

            : type === "producerApplications" ? (
              <>
                <td>{item.email}</td>
                <td>{item.producerName}</td>
                <td>{item.address}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
              </>
            )

            : (
              <>
                <td>{item.title}</td>
                <td>£{item.price}</td>
                <td>{item.stock}</td>
                <td>{item.description}</td>
              </>
            )

          )}

          <td>

            {editingId === item.id ? (
              <>
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : type === "producerApplications" ? (
              <>
                <button onClick={() => approveApplication(item.id)}>
                  Approve
                </button>

                <button onClick={() => deleteItem(item.id)}>
                  Reject
                </button>
              </>
            ) : (
              <>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </>
            )}

          </td>

        </tr>
      ))}
    </tbody>

      </table>
      <dialog id="confirmDialog" className="custom-modal">
        <div className="modal-content">
          <h3>Are you sure you want to delete?</h3>
          <p>This action cannot be undone.</p>
          <div className="modal-buttons" style={{display: "flex",
            gap: "20px"}}>
            <button id="cancelBtn" className="btn-secondary">Cancel</button>
            <button id="confirmBtn" className="btn-danger">Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
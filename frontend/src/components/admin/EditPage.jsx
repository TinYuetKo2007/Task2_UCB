import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

export default function EditPage() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
  try {
    const res = await fetch(`http://localhost:4000/${type}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const result = await res.json();

    // ensure data is always an array
    if (Array.isArray(result)) {
      setData(result);
    } else if (Array.isArray(result.users)) {
      setData(result.users);
    } else if (Array.isArray(result.products)) {
      setData(result.products);
    } else if (Array.isArray(result.data)) {
      setData(result.data);
    } else {
      setData([]);
    }

    setLoading(false);
  } catch {
    setLoading(false);
  }
}, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function deleteItem(id) {
    await fetch(`http://localhost:4000/${type}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    fetchData();
  }
  async function deleteItem(id) {
    const confirmed = window.confirm(`Are you sure you want to delete this ${type}?`);
  
    // If the user clicks "cancel" return
    if (!confirmed) return;
  
    // proceed with the delete request
    try {
      await fetch(`http://localhost:4000/${type}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
  
      // Refresh the list after successful deletion
      fetchData();
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("An error occurred while trying to delete.");
    }
  }

  if (loading) return <h1>Loading...</h1>;

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
              <>
                <th>Username</th>
                <th>Balance</th>
                <th>Action</th>
              </>
            ) : (
              <>
                <th>Product</th>
                <th>Price</th>
                <th>Action</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {type === "users" ? (
                <>
                  <td>{item.username}</td>
                  <td>£{item.balance}</td>
                </>
              ) : (
                <>
                  <td>{item.title}</td>
                  <td>£{item.price}</td>
                </>
              )}

              <td>
                <button onClick={() => deleteItem(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
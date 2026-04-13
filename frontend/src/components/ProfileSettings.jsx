import farm_food from "../image/farm_food.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  // fetch user from /me/profile
  const fetchUser = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      return navigate("/login");
    }

    try {
      const res = await fetch(
        "http://localhost:4000/me/profile",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      const data = await res.json();

      setUser(data);
      setEditForm(data);

    } catch (err) {
      console.error("User fetch error:", err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  function handleChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  }

  async function saveEdit() {
    try {
      const res = await fetch(
        "http://localhost:4000/users/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify(editForm)
        }
      );

      if (!res.ok) throw new Error("Update failed");

      alert("Profile updated");
      setEditMode(false);
      fetchUser();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  async function deleteAccount() {
    const dialog = document.getElementById("confirmDialog");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    dialog.showModal();

    const confirmed = await new Promise((resolve) => {
      confirmBtn.onclick = () => {
        dialog.close();
        resolve(true);
      };

      cancelBtn.onclick = () => {
        dialog.close();
        resolve(false);
      };
    });

    if (!confirmed) return;

    try {
      const response = await fetch(
  "http://localhost:4000/users/me",
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(editForm)
  }
);

      if (!response.ok) throw new Error("Delete failed");

      localStorage.removeItem("token");

      alert("Account deleted successfully");

      navigate("/login");

    } catch (error) {
      alert("Delete failed");
      console.error(error);
    }
  }

  if (!user) return <h2>Loading...</h2>;

  return (
    <div>
      <div className="parent-container">
        <img
          src={farm_food}
          style={{
            width: "100vw",
            height: "170px",
            objectFit: "cover",
            filter: "brightness(50%)",
          }}
        />

        <div className="bottom-left">
          <div className="main-title">
            <b>
              <h2>User Settings</h2>
            </b>
          </div>
        </div>
      </div>

      <div className="profile-settings">

        {editMode ? (
          <div className="form-container">
          <form className="form">


            <input
              name="forename"
              value={editForm.forename || ""}
              onChange={handleChange}
              placeholder="Forename"
            />

            <input
              name="surname"
              value={editForm.surname || ""}
              onChange={handleChange}
              placeholder="Surname"
            />

            <input
              name="email"
              value={editForm.email || ""}
              onChange={handleChange}
              placeholder="Email"
            />

            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </form></div>
        ) : (
          <>
            <p><b>Forename:</b> {user.forename}</p>
            <p><b>Surname:</b> {user.surname}</p>
            <p><b>Email:</b> {user.email}</p>

            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        )}

        <br />

        <button onClick={deleteAccount}>
          Delete Account
        </button>

      </div>

      <dialog id="confirmDialog" className="custom-modal">
        <div className="modal-content">
          <h3>Are you sure you want to delete your account?</h3>
          <p>This action cannot be undone.</p>

          <div
            className="modal-buttons"
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <button id="cancelBtn" className="btn-secondary">
              Cancel
            </button>

            <button id="confirmBtn" className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
import farm_food from "../image/farm_food.jpg";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const navigate = useNavigate();

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
        const response = await fetch("http://localhost:4000/users/me", {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          });

      if (!response.ok) throw new Error("Delete failed");

      // remove token
      localStorage.removeItem("token");

      alert("Account deleted successfully");

      // redirect to home or login
      navigate("/login");
    } catch (error) {
      alert("Delete failed");
      console.error(error);
    }
  }

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

      <button onClick={deleteAccount}>Delete Account</button>

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
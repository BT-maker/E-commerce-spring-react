import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role?.name !== "ADMIN") {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user || user.role?.name !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.5rem", color: "#d32f2f" }}>
        YETKİNİZ YOK<br />
        Ana sayfaya yönlendiriliyorsunuz...
      </div>
    );
  }

  return children;
};

export default AdminRoute;
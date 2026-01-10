import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  return null;
}

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";

const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Will be handled by Laravel backend
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default ResetPassword;

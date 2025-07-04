import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const response = await fetch("http://localhost:6008/verify-token", {
          method: "POST",
          credentials: "include", // send cookies automatically
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const { status, user } = data;
        console.log("verify response:", data);

        if (status) {
          setUsername(user); 
          navigate("/home"); 
        } else {
          navigate("/login"); 
        }
      } catch (err) {
        console.error("verify error:", err);
        navigate("/login"); 
      }
    };

    verifyCookie();
  }, [navigate]);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:6008/logout", {
        method: "POST",
        credentials: "include", // send cookies automatically
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const { status } = data;

      if (status) {
        navigate("/login");
      }
    } catch (err) {
      console.error("logout error:", err);
    }
  };

  return (
    <div className="home_page">
      <h4>Welcome {username}!</h4>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;

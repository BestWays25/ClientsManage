import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthContext"; // Import your authentication context

const Navbar = () => {
  // Access the authentication context
  const { user, signout } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar navbar-expand-md fixed-top navbar-shrink py-3 navbar-light" id="mainNav">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/"><span>Brand</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navcol-1">
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><a className="nav-link active" href="index.html">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/products">Products</a></li>
              <li className="nav-item"><a className="nav-link" href="/clients">Clients</a></li>
              <li className="nav-item"><a className="nav-link" href="pricing.html">Devis</a></li>
              <li className="nav-item"><a className="nav-link" href="contacts.html">Repports</a></li>
            </ul>
            {user ? ( // Check if the user is authenticated
              <div className="dropdown">
                <button
                  className="btn btn-primary shadow dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.displayName} {/* Display user's name */}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                  </li>
                  <li>
                    <button onClick={signout} className="dropdown-item">Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary shadow" role="button">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

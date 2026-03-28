import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedOrg = JSON.parse(localStorage.getItem("organization"));

    setUser(storedUser);
    setOrganization(storedOrg);
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">

        {/* User Profile Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4>User Profile</h4>
            </div>
            <div className="card-body">
              {user ? (
                <>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                </>
              ) : (
                <p>No user data found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Organization Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4>Organization Details</h4>
            </div>
            <div className="card-body">
              {organization ? (
                <>
                  <p><strong>Organization Name:</strong> {organization.name}</p>
                  <p><strong>Role:</strong> {organization.role}</p>
                  <p><strong>Department:</strong> {organization.department || "N/A"}</p>
                </>
              ) : (
                <p>No organization data found.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
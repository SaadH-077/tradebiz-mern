import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext'; // Corrected the import name to match case sensitivity
import { Navigate, Outlet } from 'react-router-dom';

// This component is responsible for rendering the layout for protected routes.
function ProtectedLayout() {
    const { user, setUser } = useContext(UserContext); // Corrected context name
    const [userDataLoaded, setUserDataLoaded] = useState(false);

    useEffect(() => {
        console.log("Checking local storage in protected layout");
        const userStored = localStorage.getItem("user");

        if (userStored) {
            console.log("User found in local storage", userStored);
            setUser(JSON.parse(userStored));
        }

        setUserDataLoaded(true);
    }, [setUser]); // Added setUser as a dependency for clarity and completeness

    if (!userDataLoaded) {
        return <div>Loading...</div>; // Placeholder for loading state
    }

    return user ? <Outlet /> : <Navigate to="/" replace />; // Use 'replace' to avoid navigation stack buildup
}

export default ProtectedLayout;

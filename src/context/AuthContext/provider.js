import React from 'react';
import AuthContext from './context';

export default function AuthProvider({ children }) {
	const [isAuthorized, setIsAuthorized] = React.useState(false);

	console.log([isAuthorized, setIsAuthorized]);

	return <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>{children}</AuthContext.Provider>;
}

import React from 'react';

const AuthContext = React.createContext(
		{
			isAuthorized: false,
			setIsAuthorized: () => {},
		}
);

export default AuthContext;

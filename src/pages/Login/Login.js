import { Button } from "@mui/material";
import {Buffer} from "buffer";
import {recoverPersonalSignature} from "eth-sig-util";
import {useHistory} from "react-router";

const Login = () => {

	const history = useHistory();

	const verifyLogin = async () => {

		const verifiedAccounts = process.env.REACT_APP_VERIFIED_ACCOUNTS.split(",").map(addr => addr.toLowerCase())

		const exampleMessage = 'Hello, you are logging in Ambrosus Bridge Backoffice \n\nHave a great day!';

		if (window.ethereum) {
			try {
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				const account = accounts[0];

				const msg = exampleMessage;  // Send the message as is
				const sign = await ethereum.request({
					method: 'personal_sign',
					params: [msg, account],  // Only pass the message and account
				});

				const recoveredAddr = recoverPersonalSignature({
					data: msg,
					sig: sign,
				});

				if (verifiedAccounts.includes(recoveredAddr.toLowerCase())) {
					document.cookie = 'backoffice verified;max-age=86400';
					history.push('/dashboard');
				}

			} catch (err) {
				console.error(err);
			}
		}
	}

	return (<section className="login">
		<Button onClick={verifyLogin} color="primary" size="large" variant="outlined">Login</Button>
	</section>);
}

export default Login;

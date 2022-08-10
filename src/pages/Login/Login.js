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
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			const account = accounts[0];

			try {
				const from = account
				const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
				const sign = await ethereum.request({
					method: 'personal_sign',
					params: [msg, from, 'Example password'],
				});

				const recoveredAddr = recoverPersonalSignature({
					data: msg,
					sig: sign,
				});
				
				if (verifiedAccounts.includes(recoveredAddr)) {
					document.cookie = 'backoffice verified;max-age=max-age-in-seconds=86400'
					history.push('/dashboard')
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

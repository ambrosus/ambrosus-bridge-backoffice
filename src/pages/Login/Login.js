import { Button } from "@mui/material";
import {Buffer} from "buffer";
import {recoverPersonalSignature} from "eth-sig-util";
import {useHistory} from "react-router";
import {useState} from "react";

const Login = () => {

	const history = useHistory();

	const [error, setError] = useState('');

	const verifyLogin = async () => {

		const verifiedAccounts = process.env.REACT_APP_VERIFIED_ACCOUNTS.split(",").map(addr => addr.toLowerCase())

		const exampleMessage = 'Hello, you are logging in Ambrosus Bridge Backoffice \n\nHave a great day!';

		if (!window.ethereum) {
			setError('Please install MetaMask');
			return;
		}

		try {
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			const account = accounts[0];

			const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
			const sign = await ethereum.request({
				method: 'personal_sign',
				params: [msg, account, 'Example password'],
			});

			const recoveredAddr = recoverPersonalSignature({
				data: msg,
				sig: sign,
			});

			if (!verifiedAccounts.includes(recoveredAddr)) {
				setError('Unauthorized account');
				return;
			}

			history.push('/dashboard');

		} catch (err) {
			console.error(err);
			const errorString = (JSON.stringify({...err}, null, 2));
			setError(errorString)
		}

	}

	return (<section className="login">
		<Button onClick={verifyLogin} color="primary" size="large" variant="outlined">Login</Button>
		<div className="error">
			{error}
		</div>
	</section>);
}

export default Login;

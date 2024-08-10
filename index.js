import express from 'express';
import { Keyring } from '@polkadot/api';
import bodyParser from 'body-parser';

// Helper functions (you'll need to implement these)
import { new_cert, build_apikey, encode_ssk, build_ssk } from './helpers.js';

const app = express();
app.use(bodyParser.json());

const keyring = new Keyring({ type: 'sr25519' });

app.post('/api/generate', async (req, res) => {
    try {
        const { seedPhrase, hashId, fields, limit } = req.body;

        const keypair = keyring.addFromUri(seedPhrase);

        const [cert_data, secret] = new_cert(keypair.address, "developer");

        const signature = keypair.sign(cert_data);

        const key = build_apikey(secret, cert_data, signature);

        const ssk_data = encode_ssk({
            ns: 0,
            key: keypair.address,
            expiration: 0,
        });
        const ssk_signature = keypair.sign(ssk_data);
        const ssk = build_ssk(ssk_data, ssk_signature);

        const client = new TimegraphClient({
            url: "https://timegraph.staging.analog.one/graphql",
            sessionKey: ssk,
        });

        const response = await client.view.data({
            hashId,
            fields,
            limit
        });

        res.json({ apiKey: key, data: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

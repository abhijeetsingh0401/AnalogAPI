import express from 'express';
import Keyring from "@polkadot/keyring";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { build_apikey, build_ssk, encode_ssk, new_cert } from "@analog-labs/timegraph-wasm";
import { TimegraphClient } from "@analog-labs/timegraph-js";
import bodyParser from 'body-parser';

await cryptoWaitReady();

const app = express();
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
    try {
        const { seedPhrase, hashId, fields, limit } = req.body;

        const keyring = new Keyring({ type: "sr25519" });
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
            limit,
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

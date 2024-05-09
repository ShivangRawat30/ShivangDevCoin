import * as mpl from "@metaplex-foundation/mpl-token-metadata";
const fs = require("fs");
import * as web3 from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { unstable_createMuiStrictModeTheme } from "@mui/material";

function loadKeypair(filename: string){
    const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[]
    const secretKey = Uint8Array.from(secret)
    return web3.Keypair.fromSecretKey(secretKey)
}
async function main() {
    console.log("let's name some tokens!");
    const myKeypair = loadKeypair("shQ4ufEV8QQk379TmJ5siE7Vx264DWm5cKo4AZNWrpP.json");
    const mintToken = new web3.PublicKey("SCiZSvd75wmyBbeK8GTAHrhSesLrXyzjQpn6BnVqHuD.json");
    const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
    const seed2 = Buffer.from(mpl.MPL_TOKEN_METADATA_PROGRAM_ID.toBytes());
    const seed3 = Buffer.from(mintToken.toBytes());
    const [metadataPDA, _pda] = web3.PublicKey.findProgramAddressSync([seed1,seed2,seed3], mpl.MPL_TOKEN_METADATA_PROGRAM_ID);
    console.log(myKeypair.publicKey.toBase58());

    const accounts = {
        metaData: metadataPDA,
        mintToken,
        mintAuthority: myKeypair.publicKey,
        payer: myKeypair.publicKey,
        updateAuthority: myKeypair.publicKey,
    }

    const dataV2 = {
        name: "ShivangCoin",
        symbol: "SHC",
        uri: ""
    }
    
    // mpl.createMetadataAccountV3
    const {token, mint } = await mpl.createAndMint(
        umi,

    )
}

main();
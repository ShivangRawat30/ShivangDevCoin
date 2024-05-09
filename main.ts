// import * as mpl from "@metaplex-foundation/mpl-token-metadata";
const fs = require("fs");
import * as web3 from "@solana/web3.js";
import * as metaplex from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  none,
  signerIdentity,
  some,
  PublicKey,
} from "@metaplex-foundation/umi";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";

function loadKeypair(filename: string) {
  const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return web3.Keypair.fromSecretKey(secretKey);
}
const INITIALIZE = false;
async function main() {
  console.log("let's name some tokens!");
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  const myKeypair = loadKeypair(
    "shQ4ufEV8QQk379TmJ5siE7Vx264DWm5cKo4AZNWrpP.json"
  );
  const mint = new web3.PublicKey(
    "SDCiUsUrxAjY5fH3QPesyMGQ4u2dBidQZMm6uwTR7Xm"
  );

  const umi = createUmi("https://api.devnet.solana.com");
  const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
  umi.use(signerIdentity(signer, true));

  const ourMetadata = {
      name: "Shivang Dev Coin",
      symbol: "SDC",
      uri: "https://raw.githubusercontent.com/ShivangRawat30/ShivangDevCoin/blob/main/SDC.jpg",
    };
    const onChainData = {
        ...ourMetadata,
        sellerFeeBasisPoints: 0,
        creators: none<metaplex.Creator[]>(),
        collection: none<metaplex.Collection>(),
        uses: none<metaplex.Uses>(),
    };
    
    
    if(INITIALIZE){
        const account: metaplex.CreateMetadataAccountV3InstructionAccounts = {
            mint: fromWeb3JsPublicKey(mint),
            mintAuthority: signer,
        };
        const data: metaplex.CreateMetadataAccountV3InstructionDataArgs = {
            isMutable: true,
            collectionDetails: null,
            data: onChainData,
        };
        const txid = await metaplex.createMetadataAccountV3(umi, {...account, ...data}).sendAndConfirm(umi);
        console.log(txid);
    }
  else{
    const data: metaplex.UpdateMetadataAccountV2InstructionData = {
        data: some(onChainData),
        discriminator: 0,
        isMutable: some(true),
        newUpdateAuthority: none<PublicKey>(),
        primarySaleHappened: none<boolean>(),
    }
    const accounts: metaplex.UpdateMetadataAccountV2InstructionAccounts = {
        metadata: metaplex.findMetadataPda(umi,{mint: fromWeb3JsPublicKey(mint)}),
        updateAuthority: signer
    }
    const txid = await metaplex.updateMetadataAccountV2(umi, {...accounts, ...data} ).sendAndConfirm(umi);
    console.log(txid)

  }
}

main();

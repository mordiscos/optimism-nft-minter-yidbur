import axios from 'axios';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import * as dotenv from 'dotenv';

dotenv.config();

const COLLECTION_ID = process.env.COLLECTION_ID;
const API_KEY = process.env.API_KEY;
const API_URL = "https://www.crossmint.com/api";

interface WalletRecord {
    wallet: string;
}

async function mintNFT(walletAddress: string) {
    const url = `${API_URL}/2022-06-09/collections/${COLLECTION_ID}/nfts`;
    const headers = {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json'
    };
    const body = {
        recipient: `optimism:${walletAddress}`,
        metadata: {
            name: "Crossmint Example NFT",
            image: "https://www.crossmint.com/assets/crossmint/logo.png",
            description: "My NFT created via the mint API!"
        }
    };

    try {
        const response = await axios.post(url, body, { headers });
        console.log(`NFT minted for wallet ${walletAddress}:`, response.data);
    } catch (error) {
        console.error(`Error minting NFT for wallet ${walletAddress}:`, error);
    }
}

function readWalletsAndMintNFTs(filePath: string) {
    fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error('Error reading CSV file:', error))
        .on('data', (row: WalletRecord) => {
            mintNFT(row.wallet);
        })
        .on('end', (rowCount: number) => console.log(`Processed ${rowCount} rows`));
}

// Specify the path to your CSV file here
const filePath = 'wallets.csv';
readWalletsAndMintNFTs(filePath);

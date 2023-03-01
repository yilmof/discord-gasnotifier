import "https://deno.land/std@0.178.0/dotenv/load.ts";
import { post } from "https://deno.land/x/dishooks@v1.1.0/mod.ts";

export interface Etherscan {
    status:  string;
    message: string;
    result:  Result;
}

export interface Result {
    LastBlock:       string;
    SafeGasPrice:    string;
    ProposeGasPrice: string;
    FastGasPrice:    string;
    suggestBaseFee:  string;
    gasUsedRatio:    string;
}

const ETHERSCAN_API_KEY = Deno.env.get("ETHERSCAN_API_KEY")
const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL")
if (!ETHERSCAN_API_KEY || !DISCORD_WEBHOOK_URL) {
    console.log("Provide .env")
    Deno.exit()
}

const checkGas = async (): Promise<number> => {
    const etherscanResp = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`)
    const data = await etherscanResp.json() as Etherscan
    
    const price = parseFloat(data.result.SafeGasPrice)
    return price
}

const runGasChecker = () => {
    setInterval(() => {
        void (async () => {
            const price = await checkGas()
            console.log(`Current gasprice: ${price}`)
            if (price < parseFloat(Deno.args[0])) {
                await post(
                    DISCORD_WEBHOOK_URL,
                    {
                        content: `Gasprice: ${price}`
                    }
                )
                console.log(`Sent discord alert for gasprice: ${price}`)
            }
        })();
    }, 10000)
}

runGasChecker()
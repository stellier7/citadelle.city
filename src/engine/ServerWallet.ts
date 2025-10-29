import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ArbitrumSepolia } from "@thirdweb-dev/chains";

const VERIFIER_ADDRESS = '0x16CFaC57D6E69cc859087aF8F819954F3E7582C6';
const ENGINE_URL = import.meta.env.VITE_THIRDWEB_ENGINE_URL || 'http://localhost:3005';
const ACCESS_TOKEN = import.meta.env.VITE_THIRDWEB_ENGINE_ACCESS_TOKEN;

export class ServerWallet {
    private static instance: ServerWallet;
    private sdk: ThirdwebSDK;

    private constructor() {
        // Initialize SDK with Engine configuration
        this.sdk = ThirdwebSDK.fromPrivateKey(
            ACCESS_TOKEN, // Access token from Engine
            ArbitrumSepolia,
            {
                secretKey: import.meta.env.VITE_THIRDWEB_SECRET_KEY,
                gasless: true,
                engineUrl: ENGINE_URL,
            }
        );
    }

    public static getInstance(): ServerWallet {
        if (!ServerWallet.instance) {
            ServerWallet.instance = new ServerWallet();
        }
        return ServerWallet.instance;
    }

    public async verifyProperty(
        contractAddress: string,
        legalIdentifier: string
    ): Promise<{ 
        success: boolean; 
        txHash?: string; 
        error?: string;
    }> {
        try {
            // Get contract instance
            const contract = await this.sdk.getContract(contractAddress);

            // Prepare the verification transaction
            const tx = await contract.prepare(
                "verifyProperty",
                [legalIdentifier]
            );

            // Send the transaction using the Engine Smart Wallet
            const result = await tx.send();
            
            // Wait for transaction confirmation
            const receipt = await result.wait();

            return {
                success: true,
                txHash: receipt.transactionHash,
            };
        } catch (error) {
            console.error("Verification error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    public async isVerifier(contractAddress: string): Promise<boolean> {
        try {
            const contract = await this.sdk.getContract(contractAddress);
            const result = await contract.call(
                "isVerifier",
                [VERIFIER_ADDRESS]
            );
            return !!result;
        } catch (error) {
            console.error("Error checking verifier status:", error);
            return false;
        }
    }
} 
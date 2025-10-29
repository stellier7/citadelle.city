import { useRWAContract } from "./RWAContract";

export function useMintNewProperty() {
    const { mintProperty, isMinting, mintError } = useRWAContract();

    const createProperty = async (
    propertyAddress: string,
        price: string,
        squareMeters: string,
    legalIdentifier: string,
    documentHash: string,
    imageURL: string,
) => {
        if (isMinting) {
            throw new Error("Contract is still loading");
        }

        if (mintError) {
            throw new Error("Contract failed to load");
        }

        try {
            const tx = await mintProperty({
                address: propertyAddress,
                price, 
                squareMeters,
                legalIdentifier, 
                documentUrl: documentHash,
                imageUrl: imageURL,
            });
            
            console.log("Transaction completed:", tx);
            return tx;
        } catch (error) {
            console.error("Error creating property:", error);
            throw error;
        }
    };

    return { createProperty, isLoading: isMinting, error: mintError };
    }
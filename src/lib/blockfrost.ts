import { BF_PID, BF_URL } from "@/config";

export const blockfrost = {
  getMetadata: async (asset: string) => {
    const url = `${BF_URL}/assets/${asset}`;

    try {
      const assetResponse = await fetch(url, {
        method: "GET",
        headers: {
          project_id: BF_PID,
        },
      });

      if (!assetResponse.ok) {
        throw new Error(`Error: ${assetResponse.statusText}`);
      }

      const result = await assetResponse.json();
      return result.onchain_metadata;
    } catch (err: any) {
      return err.message;
    }
  },

  getUtxos: async (address: string) => {
    const allUtxos: any[] = []; // Array to store all UTXOs
    let page = 1; // Start from page 1
    let hasMore = true; // Flag to continue fetching

    while (hasMore) {
      const url = `${BF_URL}/addresses/${address}/utxos?page=${page}`;

      try {
        const utxoResponse = await fetch(url, {
          method: "GET",
          headers: {
            project_id: BF_PID,
          },
        });

        if (!utxoResponse.ok) {
          throw new Error(`Error: ${utxoResponse.statusText}`);
        }

        const result = await utxoResponse.json();

        // If result is an empty array, stop the loop
        if (Array.isArray(result) && result.length === 0) {
          hasMore = false;
        } else {
          // Add current page results to allUtxos
          allUtxos.push(...result);
          page++; // Move to next page
        }
      } catch (err: any) {
        return err.message; // Return error message if fetch fails
      }
    }

    console.log(allUtxos);
    return allUtxos; // Return merged array of all UTXOs
  },
};

/**
 * General steps
 *
 * 1. Simply respond 200
 */
export const handleConnect = async (
  connectionId: string,
) => {
  console.log("Connected:", connectionId);

  return { statusCode: 200, body: "" };
};
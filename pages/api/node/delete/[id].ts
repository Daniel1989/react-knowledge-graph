import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../../utils/server/connectDB";
import { runMiddleware } from "../../../../utils/server/runMiddleware";
import Cors from "cors";

const cors = Cors({
  methods: ["DELETE", "HEAD"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await connectDB();
    if (!db) {
      return res.status(500).json({ message: "Database connection failed" });
    }

    const nodeId = req.query.id as string;

    // 1. Find the node to determine its direction
    const insideNode = await db.collection("Inside-Nodes").findOne({ id: nodeId });
    const outsideNode = await db.collection("Outside-Nodes").findOne({ id: nodeId });
    
    const node = insideNode || outsideNode;
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    // 2. Delete the node from appropriate collection
    const collectionName = insideNode ? "Inside-Nodes" : "Outside-Nodes";
    await db.collection(collectionName).deleteOne({ id: nodeId });

    // 3. Delete associated edges
    await db.collection("Edges").deleteMany({
      $or: [
        { source: nodeId },
        { target: nodeId }
      ]
    });

    return res.status(200).json({ 
      message: "Node and associated edges deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting node:", error);
    return res.status(500).json({ 
      message: "Error deleting node",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 
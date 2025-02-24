import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../utils/server/connectDB";
import { runMiddleware } from "../../../utils/server/runMiddleware";
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "HEAD"],
});

interface NodeData {
  id: string;
  name: string;
  type: "model" | "data" | "type";
  direction: "inside" | "outside";
  label: string;
  parentId: string;
  // Add any other node properties you need
}

interface EdgeData {
  id: string;
  fromId: string;
  toId: string;
  direction: "inside" | "outside";
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await connectDB();
    if (!db) {
      return res.status(500).json({ message: "Database connection failed" });
    }

    const nodeData: NodeData = req.body;
    
    // Validate required fields
    if (!nodeData.id || !nodeData.name || !nodeData.type || !nodeData.direction || !nodeData.label || !nodeData.parentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Add the node
    const collectionName = nodeData.direction === "inside" 
      ? "Inside-Nodes" 
      : "Outside-Nodes";
    
    const nodeCollection = db.collection(collectionName);
    await nodeCollection.insertOne(nodeData);

    // 2. Create and add the edge
    const edgeCollection = db.collection("Edges");
    
    // Get the last edge ID to generate a new unique edge ID
    const lastEdge = await edgeCollection
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    
    const lastEdgeNumber = lastEdge.length > 0 
      ? parseInt(lastEdge[0].id.split("-")[1]) 
      : 0;
    
    const newEdgeId = `edge-${lastEdgeNumber + 1}`;
    console.log("newEdgeId", newEdgeId, nodeData.parentId, nodeData.id, nodeData.direction);
    const edgeData: EdgeData = {
      id: newEdgeId,
      fromId: nodeData.direction === "inside" ? nodeData.id : nodeData.parentId,
      toId: nodeData.direction === "inside" ? nodeData.parentId : nodeData.id,
      direction: nodeData.direction,
      description: nodeData.label
    };

    await edgeCollection.insertOne(edgeData);

    return res.status(200).json({ 
      message: "Node and edge added successfully",
      node: nodeData,
      edge: edgeData
    });

  } catch (error) {
    console.error("Error adding node and edge:", error);
    return res.status(500).json({ 
      message: "Error adding node and edge",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 
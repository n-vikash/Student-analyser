import { MongoClient, ObjectId } from "mongodb";

let db = null;
let lastError = null;

export const getCleanURI = () => {
  const r = process.env.MONGODB_URI;
  return r ? r.trim().replace(/^["'(`\[\s]+|[)"'`\]\s]+$/g, "").replace(/\s+/g, "") : undefined;
};

export async function connectDB() {
  const uri = getCleanURI();
  if (!uri) {
    console.error("[DB] MONGODB_URI missing from environment variables");
    return;
  }
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    db = client.db("future_ai");
    console.log("✅ [DB] Connected successfully");
  } catch (err) {
    lastError = err.message;
    console.error("❌ [DB] Connection failed:", err.message);
    setTimeout(connectDB, 5000);
  }
}

export const getDB = () => db;
export const getLastError = () => lastError;

export const getUserId = (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();
  return ObjectId.isValid(cleanId) ? new ObjectId(cleanId) : cleanId;
};

export const checkDB = (req, res, next) => {
  const activeDb = getDB();
  if (activeDb) {
    next();
  } else {
    res.status(503).json({ error: "Database not ready", details: lastError });
  }
};

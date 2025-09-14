
import "dotenv/config";
import express from "express";
import { signUp, getUserById, deleteAccount, signIn } from "./services.js";

const server = express();
server.use(express.json());

server.get('/health', (_req, res) => res.status(200).json({ ok: true }));

server.post("/signup", async (req, res) =>{

    const { email, password } = req.body ||  {};
    const { data, error } = await signUp(email, password);

    if(error) {
        return res.status(error.status).json({ 
            error: error.message,
            code: error.code
         })
    }

    return res.status(201).json({ data });
});

server.post("/signin", async (req, res) => {

    const { email, password } = req.body ||  {};
    const { data, error } = await signIn(email, password);

    if(error) {
        return res.status(error.status).json({ 
            error: error.message,
            code: error.code
         })
    }

    return res.status(200).json({ 
        session : data.session,
        user: data.user
     });
})

server.get("/admin/users", async (req, res) => {
  // Protect with your admin key (or another auth mechanism)
  if (req.headers["x-admin-key"] !== process.env.INTERNAL_ADMIN_API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const userId = req.query.id;
  const { data, error } = await getUserById(userId);

  if (error) return res.status(404).json({ error: error.message });

  return res.status(200).json({
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at,
    last_sign_in_at: data.user.last_sign_in_at
  });
});

server.delete("/deleteAccount", async (req, res) => {
  const userId = req.query.id; // no need for `await`

  console.log("QUERY :: ", userId);

  const { data, error } = await deleteAccount(userId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: `Account ${userId} deleted successfully`,
    data
  });
});

const port = 3000;
server.listen(port, () => {
    console.log("Server Running on port " + port);
});

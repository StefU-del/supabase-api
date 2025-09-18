
import "dotenv/config";
import express from "express";
import { signUp, getUserById, deleteAccount, signIn, getUsers, checkJWT } from "./auth.js";
import { populateDriversTable, populateSeasonsTable, populateTeamsTable } from "./data.js";
import { supabase, supabaseAdmin, supabaseForUser } from "./supabase-client.js";

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

server.get("/checkAuth", checkJWT, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

server.get("/admin/getUserById", async (req, res) => {
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

server.get("/admin/users", async (req, res) => {
  if (req.headers["x-admin-key"] !== process.env.INTERNAL_ADMIN_API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const { data, error } = await getUsers();

  if (error) return res.status(404).json({ error: error.message });

  return res.status(200).json(data);
});

server.delete("/deleteAccount", async (req, res) => {
  const userId = req.query.id; //

  const { data, error } = await deleteAccount(userId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: `Account ${userId} deleted successfully`,
    data
  });
});

server.post("/database/drivers", async (req, res) => {
      const data = await populateDriversTable();
      return res.json({
      data,
    });
});

server.post("/database/teams", async (req, res) => {
      const data = await populateTeamsTable();
      return res.json({
      data,
    });
});

server.post("/database/seasons", async (req, res) => {
      const data = await populateSeasonsTable();
      return res.json({
      data,
    });
});

server.post("/favourites/drivers", checkJWT, async (req, res) => {
  const { driver_id, driver_name } = req.body ?? {};
  if(!driver_id || !driver_name) {
    return res.status(400).json({ error: "driver_id and driver_name are required" });
  }

  const { data, error } = await supabase.from("favourite_drivers")    
    .upsert([{ user_id: req.user.id, driver_id, driver_name }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ favourite: data });
});

server.get("/favourites/teams", checkJWT, async (req, res) => {

  const token = req.headers.authorization.replace(/^Bearer\s+/i, "");

  console.log("User ID :: ", req.user.id)

  const db = supabaseForUser(token);

  const { data, error } = await db
    .from("favourite_teams")
    .select("team_id, team_name, created_at")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

    console.log("FAVOURITE TEAMS :: ", data)

  const adminCheck = await supabaseAdmin
    .from("favourite_teams")
    .select("*")
    .eq("user_id", req.user.id);
  console.log("[ADMIN] rows for user:", adminCheck.data, adminCheck.error);

const adminAll = await supabaseAdmin
  .from("favourite_teams")
  .select("id,user_id,team_id,team_name,created_at")
  .limit(5);
console.log("[ADMIN] first 5 rows:", adminAll.data);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ favourites: data });
});

server.post("/favourites/teams", checkJWT, async (req, res) => {
  const { team_id, team_name } = req.body ?? {};
  if (!team_id || !team_name) {
    return res.status(400).json({ error: "team_id and team_name are required" });
  }

  const { data, error } = await supabase
    .from("favourite_teams")
    .upsert([{ user_id: req.user.id, team_id, team_name }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ favourite: data });
});



const port = 3000;
server.listen(port, () => {
    console.log("Server Running on port " + port);
});


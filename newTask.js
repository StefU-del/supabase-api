import { supabase } from "./supabase-client.js"

async function newTask(title, description){

   const response = await supabase.from("Tasks").insert({
        title,
        description
    }).single();

    /**
{
  error: null,
  data: null,
  count: null,
  status: 201,
  statusText: 'Created'
  }
     */

    console.log("Response: ",response)
}

async function fetchTasks(){
    const response = await supabase.from("Tasks").select("*")

    console.log("Fetch: ", response);
}

fetchTasks();
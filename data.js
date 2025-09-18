import { supabase, supabaseAdmin } from "./supabase-client.js"

export async function populateDriversTable(){
    const url = "https://f1api.dev/api/drivers?limit=1000000000000000";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            return {
                status: data.status,
                message: data.message || "Unknown Error",
            }
        }

        const drivers = data.drivers.map(driver => ({
            driver_id: driver.driverId,
            name: driver.name,
            surname: driver.surname,
            nationality: driver.nationality,
            birthday: driver.birthday,
            url: driver.url
        }))

        const databaseRes = await supabase.from("drivers").upsert(
            drivers
        )

        return databaseRes

    } catch(error) {
        return error
    }
}

export async function populateTeamsTable(){
    const url = "https://f1api.dev/api/teams?limit=1000000000";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            return {
                status: data.status,
                message: data.message || "Unknown Error",
            }
        }

        const teams = data.teams.map(team => ({
            team_id: team.teamId,
            name: team.teamName,
            nationality: team.teamNationality,
            url: team.url
        }))

        const databaseRes = await supabase.from("teams").upsert(
            teams
        )

        return databaseRes

    } catch(error) {
        return error
    }
}

export async function populateSeasonsTable(title, description){
    const url = "https://f1api.dev/api/seasons?limit=100";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            return {
                status: data.status,
                message: data.message || "Unknown Error",
            }
        }

        const seasons = data.championships.map(championship => ({
            championship_id: championship.championshipId,
            name: championship.championshipName,
            year: championship.year,
            url: championship.url
        }))

        const databaseRes = await supabase.from("seasons").upsert(
            seasons
        )

        return databaseRes

    } catch(error) {
        return error
    }
}
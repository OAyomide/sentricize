import axios from "axios";
import express, { Express, Request, Response } from "express";
import APIService from "./sentry";

const app: Express = express();
const port: number = 9000;

const apiService = new APIService("6d8aec61cda648fe9d91eda369cc747071936790f0e54bf181ce7c91417e390e");

app.get("/", async (req, res) => {
    res.send("Hey Hooman!");
});

app.get("/api/issues", async (req: Request, res: Response) => {
    const allProjects: string[] = await apiService.allProjects();
    console.log(allProjects);
    return res.status(200).json({ data: allProjects });
});

app.get("/api/orgs", async (req: Request, res: Response) => {
    let organization: string = await apiService.getOrgName()
    return res.status(200).json({
        data: {
            org_name: organization
        }
    })
})

app.listen(port, () => {
    console.log(`APP UP AND RUNNING ON PORT ${port}`);
});

// 6d8aec61cda648fe9d91eda369cc747071936790f0e54bf181ce7c91417e390e

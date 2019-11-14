import axios from "axios";
import express, { Express, Request, Response } from "express";
import APIService from "./sentry";

const app: Express = express();
const port: number = 9000;

const apiService = new APIService(process.env.SENTRY_API_KEY || "6d8aec61cda648fe9d91eda369cc747071936790f0e54bf181ce7c91417e390e");

app.get("/", async (req, res) => {
    res.send("Hey Hooman!");
});

app.get("/api/orgs", async (req: Request, res: Response) => {
    const organization: string = await apiService.getOrgName();
    return res.status(200).json({
        data: {
            org_name: organization,
        },
    });
});

app.get("/api/projects", async (req: Request, res: Response) => {
    const allProjects = await apiService.allProjects();
    return res.status(200).json({ data: allProjects });
});

app.get("/api/:org/:projectName/issues", async (req: Request, res: Response) => {
    try {
        const orgName = req.params.org ? req.params.org : null;
        const projectName = req.params.projectName ? req.params.projectName : null;

        // pass to the sentryAPI service method
        const projectIssues = await apiService.projectIssues(orgName, projectName);
        return res.status(200).json({ data: projectIssues });
    } catch (e) {

        if (e === "ENOTFOUND") {
            return res.status(404).json({
                data: "ENOTFOUND",
            });
        }
    }
});

app.listen(port, () => {
    console.log(`APP UP AND RUNNING ON PORT ${port}`);
});

// 6d8aec61cda648fe9d91eda369cc747071936790f0e54bf181ce7c91417e390e

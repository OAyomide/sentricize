import Axios, { AxiosRequestConfig } from "axios";

interface IProjectsObjectLiteral {
    platform: string;
    slug: string;
    status: string;
    orgSlug: string;
    id: string;
}
class APIService {
    private authToken: string;
    private baseURL: string;

    constructor(sentryAuthToken: string) {
        this.authToken = sentryAuthToken;
        this.baseURL = "https://sentry.io/api/0";
    }

    public async getOrgName(): Promise<string> {
        const { data } = await Axios.get(`${this.baseURL}/api/0/organizations/`, this.axiosConfig());
        const [response] = data;
        const { name } = response;

        return name;
    }
    // allPprojects method gets all the projects available for the org
    public async allProjects(): Promise<IProjectsObjectLiteral[]> {
        try {
            // make request to sentry
            const { data } = await Axios.get(`${this.baseURL}/projects/`, this.axiosConfig());
            const projectsNameArray: IProjectsObjectLiteral[] = [];

            for (const project of data) {
                const { slug, status, platform, organization: { slug: projectOrgSlug }, id } = project;
                const projectObject = {
                    platform,
                    slug,
                    status,
                    orgSlug: projectOrgSlug,
                    id,
                };
                projectsNameArray.push(projectObject);
            }
            return projectsNameArray;
        } catch (e) {
            // console.log(e);
            if (e?.response?.status === 404) {
                console.log(`ENOFOUND`, e.response);
                return e.response.status;
            }
            return e;
        }
    }

    // list all the issues in the org
    // TODO: Add support for period query.
    public async projectIssues(orgName: string, projectName: string): Promise<object> {
        try {
            // first, get the projec. either by name or by ID
            const bgOrgName = orgName ? orgName : await this.getOrgName();
            const bgProjects = await this.allProjects();
            const bgProjectName = projectName ? projectName : bgProjects[0].slug;
            const { data } = await Axios.get(`${this.baseURL}/api/${bgOrgName}/${bgProjectName}/issues/`);

            return data.data;
        } catch (e) {
            // console.log(e);
            if (e?.response?.status === 404) {
                return e.response;
            }
            throw new Error("EINTSERVER");
        }
    }

    private axiosConfig = (): AxiosRequestConfig => {
        return {
            headers: {
                Authorization: `Bearer ${this.authToken}`,
            },
        };
    }
}

export default APIService;

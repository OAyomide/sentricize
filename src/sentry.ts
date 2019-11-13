import Axios, { AxiosRequestConfig } from "axios";

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
    public async allProjects(): Promise<string[]> {
        try {
            // make request to sentry
            const { data } = await Axios.get(`${this.baseURL}/projects/`, this.axiosConfig());

            const projectsNameArray: string[] = [];

            for (const project of data) {
                const { slug } = project;
                projectsNameArray.push(slug);
            }
            return projectsNameArray;
        } catch (e) {
            console.log(e);
            return e;
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

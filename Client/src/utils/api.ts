export default class Api<ResultType> {
    private api = `${window.origin}/api`;
    private route = "";
    private method = "";
    private body: string | undefined = undefined;

    public Route(route: string) {
        this.route = route;
        return this;
    }

    public Method(method: "POST" | "PATCH" | "GET" | "DELETE") {
        this.method = method;
        return this;
    }

    public Body(body: unknown) {
        if (body) this.body = JSON.stringify(body);
        return this;
    }


    public async AwaitAsync() {
        const response = await fetch(`${this.api}/${this.route}`, {
            method: this.method,
            body: this.body
        });

        const result = await response.json() as ICustomResult<ResultType>;
        return result;
    }
}

interface ICustomResult<BodyType> {
    type: "ok" | "error" | "validationError"
    body?: BodyType
    massage?: string
    redirectTo?: string
}

import dotenv from 'dotenv';

class Environment {
    environment: any;
    constructor() {
        dotenv.config();
        this.environment = process.env;
    }

    get(key: string, defaultValue? :string) : string {
        return this.environment[key] || defaultValue;
    }
}

export { Environment };

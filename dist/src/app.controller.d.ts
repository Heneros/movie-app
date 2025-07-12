import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
    }>;
}

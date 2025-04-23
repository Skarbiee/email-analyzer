declare class SmtpAuth {
    user: string;
    pass: string;
    serviceClient: string;
    privateKey: string;
}
declare class SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    startTLS: boolean;
    sender: string;
    auth: SmtpAuth;
}
export declare class TemplateConfig {
    'user-invited': string;
    'password-reset-requested': string;
    'workflow-shared': string;
    'credentials-shared': string;
}
declare class EmailConfig {
    mode: '' | 'smtp';
    smtp: SmtpConfig;
    template: TemplateConfig;
}
export declare class UserManagementConfig {
    emails: EmailConfig;
}
export {};

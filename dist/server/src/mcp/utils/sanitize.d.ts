import type { Core } from '@strapi/strapi';
/**
 * Sanitize output data using Strapi's content API sanitizer.
 * Removes private fields and applies field-level permissions.
 */
export declare function sanitizeOutput(strapi: Core.Strapi, uid: string, data: any, auth?: {
    credentials?: any;
    ability?: any;
}): Promise<any>;
/**
 * Sanitize input data before writing to database.
 */
export declare function sanitizeInput(strapi: Core.Strapi, uid: string, data: any, auth?: {
    credentials?: any;
    ability?: any;
}): Promise<any>;

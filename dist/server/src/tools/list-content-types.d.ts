import type { Core } from '@strapi/strapi';
export type { RelationSummary, ContentTypeSummary, ComponentSummary } from '../tool-logic';
export declare function createListContentTypesTool(strapi: Core.Strapi): import("ai").Tool<Record<string, never>, import("../tool-logic").ListContentTypesResult>;

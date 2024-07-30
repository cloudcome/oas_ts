// @ref https://bobbyhadz.com/blog/typescript-process-env-type

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // package name
            PKG_NAME: string;

            // package version
            PKG_VERSION: string;

            // package description
            PKG_DESCRIPTION: string;
        }
    }
}

export {};

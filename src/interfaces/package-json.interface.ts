export interface PackageJSON {
  name: string;
  description: string;
  author: string;
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  homepage?: string;
  dependencies: object;
  devDependencies: object;
  scripts: object;
  husky: {
    hooks: {
      'pre-commit': string;
    };
  };
}

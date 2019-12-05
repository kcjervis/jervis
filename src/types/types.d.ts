declare module "*.png" {
  const value: any
  export = value
}

declare module "*package.json" {
  const package: {
    version: string
  }
  export = package
}

declare module "react-beautiful-dnd/dist/react-beautiful-dnd.min" {
  export * from "react-beautiful-dnd"
}

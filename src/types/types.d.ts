declare module '*.png' {
  const value: any
  export = value
}

declare module '*package.json' {
  const package: {
    version: string
  }
  export = package
}

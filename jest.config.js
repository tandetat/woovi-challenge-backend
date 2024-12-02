const jestTransformer = () => {
  if (process.env.JEST_TRANSFORMER === "babel-barrel") {
    // eslint-disable-next-line
    console.log("babel-barrel");

    return {
      "^.+\\.(js|ts|tsx)?$": require.resolve("./babelBarrel"),
    };
  }

  // eslint-disable-next-line
  console.log("babel-jest");

  return {
    "^.+\\.(js|ts|tsx)?$": "babel-jest",
  };
};

module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "./dist"],
  resetModules: false,
  testTimeout: 5000,
  //transform: {
  //  //...jestTransformer(),
  //  "^.+\\.(js|ts|tsx)?$": "./babelBarrel.js",
  //},
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$",
  moduleFileExtensions: ["ts", "js", "tsx", "json"],
  testEnvironment: "node",
};

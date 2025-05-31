const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "kubestellar-cluster-plugin-frontend.js",
    path: path.resolve(__dirname, "dist"),
    library: "KubeStellarClusterPlugin",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "@mui/material": "MaterialUI",
    axios: "axios",
  },
};

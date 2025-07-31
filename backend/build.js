const fs = require("fs");
const esbuild = require("esbuild");

// distフォルダをクリーン
if (fs.existsSync("dist")) {
  fs.rmSync("dist", { recursive: true, force: true });
}

// ビルド
esbuild
  .build({
    entryPoints: ["src/**/*.ts"],
    bundle: false,
    outdir: "dist",
    format: "cjs",
    target: ["es2019"],
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

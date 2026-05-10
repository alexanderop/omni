import effectPlugin from "@effect/eslint-plugin"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"]
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@effect": effectPlugin
    },
    rules: {
      "@effect/dprint": [
        "error",
        {
          config: {
            indentWidth: 2,
            lineWidth: 120,
            semiColons: "asi",
            quoteStyle: "alwaysDouble",
            trailingCommas: "never",
            operatorPosition: "maintain",
            "arrowFunction.useParentheses": "force"
          }
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-console": "off"
    }
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
)

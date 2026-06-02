import { NewsCategory } from "./types";

const AI_KEYWORDS = [
  "ai", "llm", "gpt", "openai", "anthropic", "claude", "gemini", "mistral",
  "llama", "agent", "langchain", "embedding", "generative", "copilot", "chatgpt",
  "neural", "machine learning", "deep learning", "diffusion", "transformer",
  "foundation model", "multimodal", "rag", "fine-tun", "inference", "o1", "o3",
  "grok", "perplexity", "cohere", "hugging face", "huggingface", "midjourney",
  "dall-e", "stable diffusion", "flux", "sora", "artificial intelligence",
];

const PRODUCT_KEYWORDS = [
  "launch", "launches", "launched", "release", "releases", "released", "v2", "v3",
  "introduces", "introducing", "announces", "announcing", "ships", "shipped",
  "now available", "beta", "alpha", "ga ", "generally available", "product hunt",
  "new feature", "update", "upgrade", "rebrands", "rebrand",
];

const DEV_KEYWORDS = [
  "javascript", "typescript", "python", "rust", "golang", "go lang", "react",
  "node.js", "nodejs", "docker", "kubernetes", "k8s", "api", "backend", "frontend",
  "database", "github", "programming", "developer", "open source", "npm", "package",
  "framework", "library", "sdk", "cli", "devops", "cloud", "aws", "gcp", "azure",
  "sql", "nosql", "postgres", "mongodb", "redis", "graphql", "rest api",
  "microservices", "serverless", "web dev", "code", "coding", "software",
];

export function assignCategory(title: string): NewsCategory {
  const lower = title.toLowerCase();

  if (AI_KEYWORDS.some((kw) => lower.includes(kw))) return "AI/LLM";
  if (PRODUCT_KEYWORDS.some((kw) => lower.includes(kw))) return "Products";
  if (DEV_KEYWORDS.some((kw) => lower.includes(kw))) return "Dev";
  return "General";
}

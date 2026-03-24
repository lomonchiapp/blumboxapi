import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

const prisma = new PrismaClient();

function hashApiKey(rawKey: string, pepper: string): string {
  return createHash("sha256").update(`${pepper}:${rawKey}`, "utf8").digest("hex");
}

async function main() {
  const pepper = process.env.API_KEY_PEPPER ?? "dev-pepper-change-in-production-min-16-chars";
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required for seed");
  }

  const tenant = await prisma.tenant.upsert({
    where: { slug: "blumbox" },
    create: {
      slug: "blumbox",
      name: "Blumbox",
    },
    update: {},
  });

  const rawKey = `blx_live_${randomBytes(24).toString("base64url")}`;
  const keyHash = hashApiKey(rawKey, pepper);
  const keyPrefix = rawKey.slice(0, 16);

  await prisma.apiKey.deleteMany({ where: { tenantId: tenant.id, name: "Development seed key" } });
  await prisma.apiKey.create({
    data: {
      tenantId: tenant.id,
      name: "Development seed key",
      keyHash,
      keyPrefix,
      role: "ADMIN",
    },
  });

  // eslint-disable-next-line no-console
  console.log("--- Seed OK ---");
  // eslint-disable-next-line no-console
  console.log("Tenant ID:", tenant.id);
  // eslint-disable-next-line no-console
  console.log("API key (save once):", rawKey);
  // eslint-disable-next-line no-console
  console.log("Use header X-Tenant-Id:", tenant.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

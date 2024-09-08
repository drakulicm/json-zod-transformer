import crypto from "crypto"
import os from "os"
import path from "path"
import { generate } from "ts-to-zod"

const tmpDir = os.tmpdir?.()

export async function POST(req: Request) {
  const body = await req.text()

  const filePath =
    path.join(tmpDir, crypto.randomBytes(16).toString("hex")) + ".ts"

  try {
    const schemaGenerator = generate({
      sourceText: body,
    })

    const schema = schemaGenerator.getZodSchemasFile(filePath)

    const formattedSchema = schema.split(/\r?\n/).slice(1).join("\n")

    return new Response(
      JSON.stringify({
        schema: formattedSchema,
        error: schemaGenerator.errors[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}

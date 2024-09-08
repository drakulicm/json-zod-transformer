"use client"

import { useEffect, useState } from "react"
import camelcaseKeysDeep from "camelcase-keys-deep"
import { generate } from "ts-to-zod"

import { Textarea } from "@/components/ui/textarea"

const Home = () => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const camelCaseJson = (json: string) => {
    try {
      const parsedJson = JSON.parse(json)
      const camelCaseJson = camelcaseKeysDeep(parsedJson)
      return JSON.stringify(camelCaseJson, null, 2)
    } catch (error) {
      return error instanceof Error ? error.message : String(error)
    }
  }

  const jsonToTs = (json: string) => {
    try {
      const parsedJson = JSON.parse(json)

      const generateType = (obj: any, indent = 2): string => {
        const lines = Object.entries(obj).map(([key, value]) => {
          const type = typeof value
          if (type === "object" && value !== null) {
            return `${key}: ${generateType(value, indent + 2)};`
          } else {
            return `${key}: ${type};`
          }
        })

        return `{\n${lines.map((line) => " ".repeat(indent) + line).join("\n")}\n${" ".repeat(indent - 2)}}`
      }

      return `type Root = ${generateType(parsedJson)}`
    } catch (error) {
      return error instanceof Error ? error.message : String(error)
    }
  }

  const tsToZod = (ts: string) => {
    try {
      const { getZodSchemasFile, getIntegrationTestFile, errors } = generate({
        sourceText: ts,
      })
      if (errors.length > 0) {
        return errors.join("\n")
      }

      const zodSchema = getZodSchemasFile("Root")
      return zodSchema
    } catch (error) {
      return error instanceof Error ? error.message : String(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const json = camelCaseJson(input)
      const ts = jsonToTs(json)
      const zod = tsToZod(ts)
      setOutput(zod)
    }, 500)

    return () => clearTimeout(timer)
  }, [input])

  return (
    <main className="flex p-4 gap-4 min-h-screen">
      <Textarea
        className="resize-none"
        placeholder="Paste json here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Textarea className="resize-none" readOnly value={output} />
    </main>
  )
}

export default Home

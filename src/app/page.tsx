"use client"

import { useEffect, useState } from "react"
import camelcaseKeysDeep from "camelcase-keys-deep"

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
      return error.message
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setOutput(camelCaseJson(input))
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

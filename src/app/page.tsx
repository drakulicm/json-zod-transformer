import { Textarea } from "@/components/ui/textarea"

const Home = () => {
  return (
    <main className="flex p-4 gap-4 min-h-screen">
      <Textarea className="resize-none" placeholder="Paste json here" />
      <Textarea className="resize-none" readOnly />
    </main>
  )
}

export default Home

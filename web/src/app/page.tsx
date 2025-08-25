import MonacoEditor from "../components/MonacoEditor";
import { Zap } from "lucide-react";
import MegnaticFilling from "../components/MegnaticFilling";

export default function Home() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <MegnaticFilling />
      <div className="text-center">
        <section className="container mx-auto p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-extrabold text-4xl xl:text-5xl">Not <span className="text-tertiary">Just Code</span></h1>
              <div className="flex justify-center items-center text-center gap-1">
                <h1 className="font-extrabold text-4xl xl:text-5xl">It&apos;s a Whole <span className="text-tertiary">Damn Vibe</span></h1>
              </div>
            </div>
            <div className="flex items-center justify-center text-center gap-1">
              <Zap className="w-6 h-6 text-tertiary" />
              <h2 className="text-base xl:text-xl">A bold, expressive, <span className="text-tertiary">Gen Z inspired programming language</span></h2>
              <Zap className="w-6 h-6 text-tertiary" />
            </div>
          </div>
        </section> 
        <section className="p-6 w-full h-[calc(100vh-18rem)]">
          <MonacoEditor />
        </section>
    </div>
  </div>
  );
}

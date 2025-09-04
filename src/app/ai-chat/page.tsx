import AI_Prompt from "@/components/kokonutui/ai-prompt";

export default function AIChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex-1"></div>
      <div className="flex justify-end p-4">
        <AI_Prompt />
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 container mx-auto backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span>
          Developed by{" "}
          <a
            className="font-semibold text-tertiary"
            href="https://github.com/Sharmil001"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Genzang Team
          </a>
        </span>
        <a
          className="font-semibold text-tertiary"
          href="https://github.com/Sharmil001/genz-lang/tree/main/core"
          target="_blank"
          rel="noopener noreferrer"
        >
          {"<Source />"}
        </a>
      </div>
    </div>
  );
}

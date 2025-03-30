import Editor from "react-simple-code-editor";
import { useState } from "react";
import Prism, { languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; // Optional: You can choose a different theme or customize your own.
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const ProblemPage = () => {
  const [code, setCode] = useState(
    `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`
  );

  const [codeOutput, setCodeOutput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunCode = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/run`,
        {
          code: code,
          language: "cpp",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;

      if (data.status === "SUCCESS") {
        toast.success("Code executed successfully!");
        console.log("Code executed successfully:", data.output);
        setCodeOutput(data.output);
        // Display the output in the output section
      }
    } catch (error) {
      console.error("Error running code:", error);
      // Handle error (e.g., show a notification to the user)
      toast.error("Error running code: " + error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Code Editor */}
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) =>
          Prism.highlight(code, Prism.languages.javascript, "javascript")
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          border: "1px solid #ddd",
          borderRadius: "4px",
          width: "50%",
          height: "400px",
          overflow: "auto",
          backgroundColor: "#f5f5f5",
          color: "#333",
          lineHeight: "1.5",
          whiteSpace: "pre",
          overflowWrap: "break-word",
        }}
      />

      {/* Submit Button */}
      <Button className="mt-4" onClick={handleRunCode}>
        Submit Code
      </Button>

      {/* Output */}

      <div className="mt-4 p-4 border border-gray-300 rounded-lg w-1/2">
        <h2 className="text-lg font-semibold">Output</h2>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            minHeight: "100px",
          }}
        >
          {codeOutput}
        </pre>
      </div>
    </div>
  );
};

export default ProblemPage;

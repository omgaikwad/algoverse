import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface ProblemData {
  title: string;
  description: string;
  input: string;
  output: string;
  testCases: string;
}

const AdminDashboard = () => {
  const [problemData, setProblemData] = useState<ProblemData>({
    title: "",
    description: "",
    input: "",
    output: "",
    testCases: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform form submission logic here
    console.log("Form submitted:", problemData);

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/problem`, problemData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.status === "SUCCESS") {
        toast.success("Problem added successfully!");
        console.log("Problem added successfully:", response.data);
        setLoading(false);
        setError(null); // Clear any previous error messages

        // Reset the form after submission
        setProblemData({
          title: "",
          description: "",
          input: "",
          output: "",
          testCases: "",
        });
      } else {
        setLoading(false);
        setError("Failed to add the problem. Please try again.");
        console.log("Error adding problem:", response.data);
        toast.error("Failed to add the problem. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit the form. Please try again.");
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {/* ADD PROBLEM FORM */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleFormSubmit(e)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  autoFocus
                  required
                  value={problemData.title}
                  onChange={(e) =>
                    setProblemData({ ...problemData, title: e.target.value })
                  }
                  id="title"
                  placeholder="Title"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  required
                  value={problemData.description}
                  onChange={(e) =>
                    setProblemData({
                      ...problemData,
                      description: e.target.value,
                    })
                  }
                  id="description"
                  placeholder="Description"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="input">Input</Label>
                <Input
                  required
                  value={problemData.input}
                  onChange={(e) =>
                    setProblemData({ ...problemData, input: e.target.value })
                  }
                  id="input"
                  placeholder="Input"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="output">Output</Label>
                <Input
                  required
                  value={problemData.output}
                  onChange={(e) =>
                    setProblemData({ ...problemData, output: e.target.value })
                  }
                  id="output"
                  placeholder="Output"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="testCases">Test Cases</Label>
                <Input
                  required
                  value={problemData.testCases}
                  onChange={(e) =>
                    setProblemData({
                      ...problemData,
                      testCases: e.target.value,
                    })
                  }
                  id="testCases"
                  placeholder="Test Cases"
                />
              </div>
            </div>

            <CardFooter className="flex justify-between mt-4 p-0">
              <Button variant="outline">Reset</Button>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </CardFooter>
          </form>

          {/* Show Error */}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const URL = "https://api.google.com/youtube/v3/videos";
export default function ApiInputPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Input Panel</h3>
      <ButtonGroup className="w-full">
        <Input value={URL} disabled />
        <Button variant="secondary">Submit</Button>
      </ButtonGroup>
    </div>
    // <Card>
    //   <CardContent>
    //     <p>Input Panel</p>
    //   </CardContent>
    // </Card>
  );
}

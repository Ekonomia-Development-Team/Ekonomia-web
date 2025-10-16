import DrawerDemo from "../components/drawer/drawer";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Text from "../components/ui/text";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold underline p-6">Hello, Next.js!</h1>
      <Button>Click Me</Button>
      <Text>This is a text component</Text>
      <Input placeholder="Type here..." />
      <DrawerDemo />
    </div>
  );
}

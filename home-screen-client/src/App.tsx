import "@mantine/core/styles.css";
import { Center, MantineProvider, Image } from "@mantine/core";
import { theme } from "./theme";
import Buttons from "./Components/Buttons";
import TextInputs from "./Components/Inputs";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Center mt="xl">
        <div style={{ width: 600, margin: 'auto' }}>
          <Image
            radius="md"
            src="/src/assets/logo.png"
            alt="Random unsplash image"
          />
        </div>
      </Center>
      <Center mt="xl">
        <TextInputs />
      </Center>
      <Center mt="xl">
        <Buttons />
      </Center>
    </MantineProvider>
    );
}

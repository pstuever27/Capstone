import {Button} from "@mantine/core"

function Buttons() {
    return (
        <Button
          variant="gradient"
          gradient={{ from: 'blue', to: 'teal', deg: 90 }}
          size="lg"
          radius="lg"
        >
          Sync
        </Button>
      );
}

export default Buttons;
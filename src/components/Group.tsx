import { Button, Text } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Button> & {
  name: string;
  isActive?: boolean;
};

export function Group({ name, isActive = false, ...rest }: Props) {
  return (
    <Button
      size="md"
      bg="$gray600"
      mr="$3"
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      borderColor="$green500"
      borderWidth={isActive ? 1 : 0}
      //Active on click
      sx={{
        ":active": {
          borderWidth: 1,
        },
      }}
      {...rest}
    >
      <Text
        color={isActive ? "$green500" : "$gray200"}
        textTransform="uppercase"
        fontSize="$xs"
        fontFamily="$heading"
      >
        {name}
      </Text>
    </Button>
  );
}

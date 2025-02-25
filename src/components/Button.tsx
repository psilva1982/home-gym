import { ComponentProps } from "react";
import {
  Button as GluestackButton,
  Text,
  ButtonSpinner,
} from "@gluestack-ui/themed";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  variant?: "solid" | "outline";
  isLoading?: boolean;
};

export function Button({
  title,
  isLoading = false,
  variant = "solid",
  ...rest
}: Props) {
  return (
    <GluestackButton
      w="$full"
      h="$14"
      bg={variant === "solid" ? "$green700" : "transparent"}
      borderWidth={variant === "solid" ? "$0" : "$1"}
      borderColor="$green500"
      rounded="$sm"
      $active-bg={variant === "solid" ? "$green500" : "$gray500"}
      disabled={isLoading}
      opacity={isLoading ? 0.7 : 1}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner color="$white" />
      ) : (
        <Text
          color={variant === "solid" ? "$white" : "$green500"}
          fontFamily="$heading"
          fontSize="$sm"
        >
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}

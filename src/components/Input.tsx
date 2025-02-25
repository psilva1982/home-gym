import {
  Input as GlueStatckInput,
  InputField,
  FormControl,
  FormControlErrorText,
  FormControlError,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";
import { Form } from "react-hook-form";

type Props = ComponentProps<typeof InputField> & {
  isReadOnly?: boolean;
  isInvalid?: boolean;
  errorMessage?: string | null;
};

export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={invalid} mb="$4" w="$full">
      <GlueStatckInput
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? "$red500" : "$green500",
        }}
        isReadOnly={isReadOnly}
        isInvalid={invalid}
        $invalid={{
          borderWidth: 1,
          borderColor: "$red500",
        }}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          bg="$gray700"
          px="$4"
          color="$white"
          fontFamily="$body"
          placeholderTextColor="$gray300"
          cursorColor="gray"
          {...rest}
        />
      </GlueStatckInput>
      <FormControlError>
        <FormControlErrorText color="$red500">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}

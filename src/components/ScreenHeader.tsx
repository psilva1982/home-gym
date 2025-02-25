import { Center, Heading } from "@gluestack-ui/themed";

type Props = {
  title: string;
};

export function ScreenHeader({ title }: Props) {
  return (
    <Center bg="$gray600" pb="$6" pt="$16">
      <Heading color="$gray100" fontFamily="$heading" fontSize="$xl">
        {title}
      </Heading>
    </Center>
  );
}

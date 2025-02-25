import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

type Props = {
  data: HistoryDTO;
};

export function HistoryCard({ data }: Props) {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mb="$3"
      bg="$gray600"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack flex={1} mr="$5">
        <Heading
          color="$white"
          fontSize="$md"
          textTransform="capitalize"
          fontFamily="$heading"
          numberOfLines={1}
        >
          {data.group}
        </Heading>
        <Text color="$gray100" fontSize="$lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>
      <Text color="$gray300" fontSize="$md">
        {data.hour}
      </Text>
    </HStack>
  );
}

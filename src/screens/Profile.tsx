import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { Controller, useForm } from "react-hook-form";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import { useAuth } from "@hooks/useAuth";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  newPassword: string;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe seu nome."),
  email: yup.string().required("Informe seu email.").email("Email inválido"),
  oldPassword: yup.string(),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  newPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação da senha está incorreta")
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a confirmação da senha.")
          .transform((value) => (!!value ? value : null)),
    }),
});

type ProfileSchemaProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isUpdating, setUpdating] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchemaProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        //base64: true
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Essa imagem é muito grande, escolha uma imagem menor que 5mb."
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();
        const photoFile = {
          name: `${user.name}.${fileExtension}`
            .toLocaleLowerCase()
            .replace(" ", "_"),
          uri: photoURI,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const response = await api.patch("/users/avatar", userPhotoUploadForm, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const userUpdated = user;
        userUpdated.avatar = response.data.avatar;
        await updateUserProfile(userUpdated);

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="success"
              title="Foto atualizada com sucesso!"
              onClose={() => toast.close(id)}
            />
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleProfileUpdate(data: ProfileSchemaProps) {
    try {
      setUpdating(true);
      const response = await api.put("/users", {
        ...data,
        old_password: data.oldPassword,
      });

      const updatedUser = user;
      updatedUser.name = data.name;

      await updateUserProfile(updatedUser);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Dados atualizados com sucesso!"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar seus dados.";
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      >
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : defaultUserPhotoImg
            }
            alt="Usuário"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="$gray600"
                placeholder="E-mail"
                isReadOnly
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>
          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange } }) => (
              <Input
                bg="$gray600"
                onChangeText={onChange}
                placeholder="Senha antiga"
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="$gray600"
                onChangeText={onChange}
                placeholder="Nova senha"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange } }) => (
              <Input
                bg="$gray600"
                onChangeText={onChange}
                placeholder="Confirme a nova senha"
                secureTextEntry
                errorMessage={errors.newPassword?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
